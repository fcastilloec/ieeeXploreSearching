#!/usr/bin/env node
import { basename, dirname, join } from 'node:path';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { Command, Option } from 'commander';
import dotenv from 'dotenv';
import pkg_ from '../package.json' with { type: 'json' };
import { checkAPIKey } from './lib/api-key.mjs';
import { configDirectory } from './lib/config-directory.mjs';
import { testYears, checkQueryText, testFileExtension, redError } from './lib/helpers.mjs';
import { FIELDS, removeConflict, addDataField, queryContainsField } from './lib/data-fields.mjs';
import { scrap, api, scrapLink } from './lib/ieee-api.mjs';
import { fromResults as json2xls } from './lib/json2xls.mjs';

if (process.platform === 'win32') {
  console.warn("You're running on a Windows system");
  console.warn(
    '\u001B[4m%s\u001B[0m\u001B[31;1m%s\u001B[0m\n\n',
    'Make sure you escape double quotes using:',
    String.raw` \"`,
  );
}

dotenv.config({ quiet: true, path: ['.env', 'env'] }); // read env variables from both '.env' and 'env'

const IEEE_FIELD_DESC = `IEEE Data Fields (mutually exclusive).
Prepends this field to every term and quoted phrase in your query.
Example: nano AND "fiber cable" → "Field":nano AND "Field":"fiber cable"
`;

const program = new Command();

program
  .usage('<query> [options] [IEEE Data Fields]')
  .showHelpAfterError()
  .description('Search IEEE content with API or scraper and export results')
  .configureOutput({
    outputError: (str, write) => write(redError(str, false)),
  });

// Required positional <query>
program.argument('<query>', 'Search query');

// Options
program
  .option(
    '-o, --output <filename>',
    `Filename where results are saved, without extension.\nCan use env variable OUT (check '${basename(process.argv[1])} --help-env' for more info).`,
  )
  // --year as REPEATABLE (not variadic) so it doesn't eat the query
  .addOption(
    new Option(
      '-y, --year <number>',
      `Specify a single year (-y 2000) or a range (-y 2000 -y 2005).\nCan use env variable YEARS (check '${basename(process.argv[1])} --help-env' for more info).`,
    )
      // creates an array (concat) of all passed 'year' arguments.
      // First argument needs empty array to start
      .argParser((value, previous) => (previous || []).concat(Number(value))),
  )
  .option('-s, --scrap', 'Scrap the IEEE website instead of using the default IEEE API', false)
  .option('-e, --excel', 'Export results as an Excel file in addition to the JSON output', false)
  .option(
    '-a, --all-content-types',
    'Include all content types in the search.\nBy default, only Magazines, Conferences, and Journals are searched; this flag adds Courses, Early Access, Books, and Standards.',
    false,
  )
  .option(
    '-l, --link-only',
    'Display the generated search URL without fetching results.\nUse this to debug queries or to open the search directly on the IEEE website for manual filtering.',
    false,
  )
  .option('--help-env', 'show help for user environmental variables')
  // Repeatable -v -> count occurrences
  .addOption(
    new Option('-v, --verbose', 'Show extra info')
      .argParser((_, prev) => (typeof prev === 'number' ? prev + 1 : 1))
      .default(0),
  )
  .version(pkg_.version)
  // --- IEEE Data Fields: grouped & mutually exclusive (grouped for help only)
  .addOption(
    new Option('-b, --abstract', '"Abstract"').helpGroup(IEEE_FIELD_DESC).conflicts(removeConflict('abstract')),
  )
  .addOption(
    new Option(
      '-f, --full-text-and-metadata',
      `"Full Text & Metadata"\nCan use env variable FULL (check '${basename(process.argv[1])} --help-env' for more info).`,
    )
      .helpGroup(IEEE_FIELD_DESC)
      .conflicts(removeConflict('fullTextAndMetadata')),
  )
  .addOption(
    new Option('-t, --text-only', '"Full Text Only"').helpGroup(IEEE_FIELD_DESC).conflicts(removeConflict('textOnly')),
  )
  .addOption(
    new Option('-p, --publication-title', '"Publication Title"')
      .helpGroup(IEEE_FIELD_DESC)
      .conflicts(removeConflict('publicationTitle')),
  )
  .addOption(
    new Option('-d, --document-title', '"Document Title"')
      .helpGroup(IEEE_FIELD_DESC)
      .conflicts(removeConflict('documentTitle')),
  )
  .addOption(
    new Option('-m, --metadata', '"All Metadata"').helpGroup(IEEE_FIELD_DESC).conflicts(removeConflict('metadata')),
  )
  .addOption(
    new Option('-i, --ieee-terms', '"IEEE Terms"').helpGroup(IEEE_FIELD_DESC).conflicts(removeConflict('ieeeTerms')),
  );

// Examples (keep; data field list is no longer appended manually)
program.addHelpText(
  'after',
  `
Examples:
  $ ${basename(process.argv[1])} 'optics AND nano' -o search1 -y 1990 -y 2000 -e
    searches for "optics AND nano" between 1990-2000 and saves results to search1.json and search1.xls

  $ ${basename(process.argv[1])} 'h264 NEAR/3 cellular' -y 2005 -o search2.json
    searches for "h264 NEAR/3 cellular" only in 2005 and saves results to search2.json
`,
);

program.on('option:help-env', () => {
  console.log(`
User Environment Variables:
  APIKEY        Your secret API key. Required to run searching via the official IEEE API.

  YEAR          A specific year or a colon-separated range to limit the search.
                Examples: YEAR=2005 or YEAR=1990:2000

  OUT           Filename where results will be saved (without extension).
                If OUT is an integer, the output will be "search{num}".
                Examples: OUT=search (Saves as search.json and/or search.xls)
                OUT=2 (Saves as search2.json and/or search2.xls)

  FULL          Set to 'true' to use the "Full Text & Metadata" data field for searches.
                Example: FULL=true

  CONFIG_DIR    Path to the directory where configuration is stored.
                If not set, the default is your OS's standard path (i.e. AppData on Windows)
                Example: CONFIG_DIR=/home/user/ieeeConfig/

  IEEE_FONT     The font to use for Excel exports. Defaults to 'Liberation Serif'.
                Example: IEEE_FONT=Arial

  SCIHUBDOMAIN  The Sci-Hub domain to use. Valid values: se, ru, st, red, etc.
                Example: SCIHUBDOMAIN=se
    `);
  process.exit(0); // needed to stop parsing and not throw validation errors
});

// ------------------------------
// Parse and validate
// ------------------------------
program.parse(process.argv);
const opts = program.opts();
const args = program.processedArgs || program.args; // Commander 12 keeps processedArgs

let queryText = args[0];
let years = opts.year;
if (!opts.year) {
  if (process.env.YEARS) {
    if (opts.verbose) console.log(`Using env YEARS (${process.env.YEARS})`);
    years = process.env.YEARS.split(':').map((year) => Number.parseInt(year, 10)); // creates an array of years
  } else {
    redError('Missing required argument: --year <number...>\n');
    program.help({ error: true });
  }
}
opts.year = years.length == 1 ? [years[0], years[0]] : years;
try {
  testYears(opts.year);
  checkQueryText(queryText);
} catch (error) {
  redError(error.message + '\n');
  program.help({ error: true });
}

// --output; allow OUT env override
let output = opts.output;
if (process.env.OUT) {
  if (opts.verbose) console.log(`Using env OUT (${process.env.OUT})`);
  output = /^[1-9]\d*$/.test(process.env.OUT) ? `search${process.env.OUT}` : process.env.OUT;
  if (opts.verbose) console.log(`OUT: ${output}`);
}
if (!output && !opts.linkOnly) {
  redError('Missing required option: --output <filename> (or set OUT env variable)\n');
  program.help({ error: true });
}

// Verbosity level
const verbosity = Number(opts.verbose) || 0;
if (verbosity >= 2) {
  // Log parsed state as an object, similarly to yargs argv dump
  console.log('Arguments: ', {
    output,
    abstract: !!opts.abstract,
    fullTextAndMetadata: !!opts.fullTextAndMetadata,
    textOnly: !!opts.textOnly,
    publicationTitle: !!opts.publicationTitle,
    documentTitle: !!opts.documentTitle,
    metadata: !!opts.metadata,
    ieeeTerms: !!opts.ieeeTerms,
    excel: !!opts.excel,
    year: opts.year,
    scrap: !!opts.scrap,
    verbose: verbosity,
    allContentTypes: !!opts.allContentTypes,
    linkOnly: !!opts.linkOnly,
    query: queryText,
  });
}

console.log('Searching for: %s', queryText);
console.log('Between %s and %s', opts.year[0], opts.year[1]);
const content = opts.allContentTypes ? 'All' : 'Journals, Magazines, Conferences';
console.log(`Searching for type: ${content}`);

// Don't add fields if they're already there
if (!queryContainsField(queryText)) {
  // Prioritize command line arguments over environmental variables
  const dataFieldKey =
    Object.keys(FIELDS).find((key) => opts[key]) || (process.env.FULL === 'true' ? 'fullTextAndMetadata' : null);

  if (dataFieldKey) queryText = addDataField(queryText, FIELDS[dataFieldKey]);
  console.log('Using: %s', dataFieldKey ? FIELDS[dataFieldKey] : 'No data fields');
}

// ------------------------------
// Main logic
// ------------------------------
async function search() {
  let results;
  if (opts.scrap) {
    results = await scrap(queryText, opts.year, opts.allContentTypes, verbosity);
  } else {
    const configFile = join(configDirectory(), 'config.json');
    checkAPIKey(configFile);
    try {
      const config = JSON.parse(readFileSync(configFile, 'utf8')); // Read the API_KEY
      results = await api(config.APIKEY, queryText, opts.year, opts.allContentTypes, verbosity);
    } catch (error) {
      redError(`Error reading the APIKEY: ${error.message}`);
      process.exit(1);
    }
  }

  console.log('Found %s results', results.total_records);
  if (!opts.scrap && results.total_records > 200) {
    console.warn('WARNING: API searches are limited to fetching 200 results');
    console.warn('\t Consider using scraping or narrowing your search');
  }

  if (results.total_records > 0) {
    try {
      const jsonPath = testFileExtension(output, '.json');
      // create the parent directory if it doesn't exist
      const dir = dirname(jsonPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(jsonPath, JSON.stringify(results.articles, null, 1));
      if (opts.excel) await json2xls(results.articles, testFileExtension(output, '.xls'));
    } catch (error) {
      redError(`Error writing JSON or XLS file:\n${error.message}`);
      process.exit(4);
    }
  }
}

if (opts.linkOnly) {
  const query = scrapLink(queryText, opts.year, opts.allContentTypes);
  console.log('Encoded Query: %s\n', query);
} else if (!process.env.CI) {
  search();
}
