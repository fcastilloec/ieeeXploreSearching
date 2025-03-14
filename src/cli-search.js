#!/usr/bin/env node
const path = require('node:path');
const fs = require('fs-extra');
const yargs = require('yargs');
const checkAPIKey = require('./lib/api-key');
const configDirectory = require('./lib/config-directory');
const { testYears, checkQueryText, testFileExtension } = require('./lib/helpers');
const { FIELDS, addDataField, queryContainsField } = require('./lib/data-fields');
const ieee = require('./lib/ieee-api');
const { fromResults: json2xls } = require('./lib/json2xls');

if (process.platform === 'win32') {
  console.warn("You're running on a Windows system");
  console.warn(
    '\u001B[4m%s\u001B[0m\u001B[31;1m%s\u001B[0m\n\n',
    'Make sure you escape double quotes using:',
    String.raw` \"`,
  );
}

require('dotenv').config({ path: ['.env', 'env'] }); // read env variables from both '.env' and 'env'

const { argv } = yargs
  .wrap(yargs.terminalWidth())
  .version(require('../package.json').version)
  .usage('Usage: $0 <query> [options] [IEEE Data Fields]')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 1, 'No search query specified')
  .option('output', {
    alias: 'o',
    describe:
      'Filename where results are saved as JSON.\nCan use env variable OUT.\nIt OUT is an integer, the output will be "search{num}"',
    nargs: 1,
    type: 'string',
    demandOption: !process.env.OUT,
    normalize: true,
  })
  .option('full-text-and-metadata', {
    alias: 'f',
    conflicts: ['text-only', 'publication-title', 'document-title', 'metadata', 'ieee-terms'],
    describe: '"Full Text & Metadata".\nUse env "FULL=true"',
    type: 'boolean',
  })
  .option('text-only', {
    alias: 't',
    conflicts: ['full-text-and-metadata', 'publication-title', 'document-title', 'metadata', 'ieee-terms'],
    describe: '"Full Text Only"',
    type: 'boolean',
  })
  .option('publication-title', {
    alias: 'p',
    conflicts: ['text-only', 'full-text-and-metadata', 'document-title', 'metadata', 'ieee-terms'],
    describe: '"Publication Title"',
    type: 'boolean',
  })
  .option('document-title', {
    alias: 'd',
    conflicts: ['text-only', 'full-text-and-metadata', 'metadata', 'ieee-terms', 'publication-title'],
    describe: '"Document Title"',
    type: 'boolean',
  })
  .option('metadata', {
    alias: 'm',
    describe: '"All Metadata"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'document-title', 'ieee-terms'],
    type: 'boolean',
  })
  .option('ieee-terms', {
    alias: 'i',
    describe: '"IEEE Terms"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'document-title', 'metadata'],
    type: 'boolean',
  })
  .option('excel', {
    alias: 'e',
    describe: 'Whether to also save results as excel file in addition to JSON',
    default: false,
    type: 'boolean',
  })
  .option('year', {
    alias: 'y',
    nargs: 1,
    demandOption: !process.env.YEARS,
    describe:
      'Calling it once will search only on that year. Calling twice will search on the range.\n' +
      'Use env "YEARS=2000:2001"',
    // array will consume all arguments after -y, including the query. No way to make array nargs variable
    type: 'number',
    array: true,
  })
  .option('scrap', {
    alias: 's',
    describe: 'Scrap the IEEE website instead of using the default search API',
    default: false,
    type: 'boolean',
  })
  .option('verbose', {
    alias: 'v',
    describe: 'Show extra info',
    type: 'count',
  })
  .option('all-content-types', {
    alias: 'a',
    describe:
      'Search across all content types.\n' +
      'Default content types: Magazines, Conferences, Journals.\n' +
      'Excluded: Courses, Early Access, Books, Standards',
    default: false,
    type: 'boolean',
  })
  .parserConfiguration({
    'strip-aliased': true,
    'strip-dashed': true,
  })
  .coerce({
    year: (year) => (year.length == 1 ? [year[0], year[0]] : year),
  })
  .check((arguments_) => {
    if (!process.env.YEARS) testYears(arguments_.year);
    checkQueryText(arguments_._[0]);
    return true;
  })
  .group(
    ['full-text-and-metadata', 'text-only', 'publication-title', 'document-title', 'metadata', 'ieee-terms'],
    'IEEE Data Fields',
  )
  .example(
    "$0 'optics AND nano' -o search1 -y 1990 -y 2000 -e",
    'searches for "optics AND nano" between 1990-2000 and save the results in search1.json and search1.xls',
  )
  .example(
    "$0 'h264 NEAR/3 cellular' -y 2005 -o search2.json",
    'searches for "h264 NEAR/3 cellular" only on 2005, and save the results in search2.json',
  );

/* Assigns environmental variables if present */
// Sets year from env variable 'YEARS'
if (process.env.YEARS) {
  if (argv.verbose) console.log(`Using env YEARS (${process.env.YEARS})`);
  const years = process.env.YEARS.split(':').map((year) => Number.parseInt(year, 10)); // creates an array of years
  try {
    testYears(years);
  } catch (error) {
    console.error(`YEARS env variable: ${error.message}`);
    process.exit(1);
  }
  argv.year = years.length === 1 ? [years[0], years[0]] : years;
}

// Sets output name based on env variable 'OUT'
if (process.env.OUT) {
  if (argv.verbose) console.log(`Using env OUT (${process.env.OUT})`);
  argv.output = /^[1-9]\d*$/.test(process.env.OUT) ? `search${process.env.OUT}` : process.env.OUT;
  if (argv.verbose) console.log(`OUT: ${argv.output}`);
}

console.log('Searching for: %s', argv._[0]);
console.log('Between %s and %s', argv.year[0], argv.year[1]);

let queryText = argv._[0];
if (!queryContainsField(argv._[0])) {
  const dataFieldKey =
    process.env.FULL === 'true' ? 'fullTextAndMetadata' : Object.keys(FIELDS).find((key) => argv[key]);

  if (dataFieldKey) queryText = addDataField(queryText, FIELDS[dataFieldKey]);
  console.log('Using: %s', FIELDS[dataFieldKey] || 'No data fields');
}

async function search() {
  let results;
  if (argv.scrap) {
    results = await ieee.scrap(queryText, argv.year, argv.allContentType, argv.verbose);
  } else {
    const configFile = path.join(configDirectory(), 'config.json');
    checkAPIKey(configFile);
    try {
      const config = fs.readJSONSync(configFile); // Read the API_KEY
      results = await ieee.api(config.APIKEY, queryText, argv.year, argv.allContentType, argv.verbose);
    } catch (error) {
      console.error('Error reading the APIKEY:', error.message);
      process.exit(1);
    }
  }

  console.log('Found %s results', results.total_records);
  if (!argv.scrap && results.total_records > 200) {
    console.warn('WARNING: API searches are limited to fetching 200 results');
    console.warn('\t Consider using scraping or narrowing your search');
  }
  if (results.total_records > 0) {
    try {
      await fs.ensureFile(testFileExtension(argv.output, '.json')); // create the parent directory if it doesn't exist
      await fs.writeJson(testFileExtension(argv.output, '.json'), results.articles, { spaces: 1 });
      if (argv.excel) await json2xls(results.articles, testFileExtension(argv.output, '.xls'));
    } catch (error) {
      console.error(`Error writing JSON or XLS file:\n${error.message}`);
      process.exit(4);
    }
  }
}
search();
