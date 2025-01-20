#!/usr/bin/env node
const path = require('node:path');
const _ = require('lodash');
const fs = require('fs-extra');
const yargs = require('yargs');
const checkAPIKey = require('./lib/api-key');
const configDirectory = require('./lib/config-directory');
const { testYear } = require('./lib/utils');
const { FIELDS, addDataField } = require('./lib/data-fields');
const ieee = require('./lib/ieee-api');
const { fromResults: json2xls } = require('./lib/json2xls');
const { testFileExtension } = require('./lib/utils');

if (process.platform === 'win32') {
  console.warn("You're running on a Windows system");
  console.warn('\u001B[4m%s\u001B[0m\u001B[31;1m%s\u001B[0m\n\n', 'Make sure you escape double quotes using:', String.raw` \"`);
}

const { argv } = yargs
  .wrap(yargs.terminalWidth())
  .version(require('../package.json').version)
  .usage('Usage: $0 <query> [options] [IEEE Data Fields]')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 1, 'No search query specified')
  .option('output', {
    alias: 'o',
    describe: 'Filename where to save results as JSON',
    nargs: 1,
    type: 'string',
    demandOption: !process.env.OUT,
    normalize: true,
  })
  .option('full-text-and-metadata', {
    alias: 'f',
    conflicts: ['text-only', 'publication-title', 'metadata', 'ieee-terms'],
    describe: '"Full Text & Metadata"',
    type: 'boolean',
  })
  .option('text-only', {
    alias: 't',
    conflicts: ['full-text-and-metadata', 'publication-title', 'metadata', 'ieee-terms'],
    describe: '"Full Text Only"',
    type: 'boolean',
  })
  .option('publication-title', {
    alias: 'p',
    conflicts: ['text-only', 'full-text-and-metadata', 'metadata', 'ieee-terms'],
    describe: '"Publication Title"',
    type: 'boolean',
  })
  .option('metadata', {
    alias: 'm',
    describe: '"All Metadata"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'ieee-terms'],
    type: 'boolean',
  })
  .option('ieee-terms', {
    alias: 'i',
    describe: '"IEEE Terms"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'metadata'],
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
    demandOption: !(process.env.YEAR_START || process.env.YEAR_END),
    describe: 'Calling it once will search only on that year. Calling twice will search on the range',
    // array will consume all arguments after -y, including the query. No way to make array nargs variable
    type: 'number',
    coerce: (year) => (Array.isArray(year) ? year : [year, year]),
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
  .parserConfiguration({
    'strip-aliased': true,
    'strip-dashed': true,
  })
  .check((arguments_) => {
    if (arguments_.year) {
      if (arguments_.year.length > 2) throw new Error('Only start and/or finish year are accepted');
      for (const year of arguments_.year) testYear(year);
    }
    return true;
  })
  .group(['full-text-and-metadata', 'text-only', 'publication-title', 'metadata', 'ieee-terms'], 'IEEE Data Fields')
  .example(
    "$0 'optics AND nano' -o search1 -y 1990 -y 2000 -e",
    'searches for "optics AND nano" between 1990-2000 and save the results in search1.json and search1.xls',
  )
  .example(
    "$0 'h264 NEAR/3 cellular' -y 2005 -o search2.json",
    'searches for "h264 NEAR/3 cellular" only on 2005, and save the results in search2.json',
  );

/* Assigns environmental variables if present */
// Sets year from env variables 'YEAR_START' and/or 'YEAR_END'
if (process.env.YEAR_START && process.env.YEAR_END) {
  argv.year = [Number.parseInt(process.env.YEAR_START, 10), Number.parseInt(process.env.YEAR_END, 10)];
} else if (process.env.YEAR_START || process.env.YEAR_END) {
  argv.year = [Number.parseInt(process.env.YEAR_START || process.env.YEAR_END, 10), Number.parseInt(process.env.YEAR_START || process.env.YEAR_END, 10)];
}
// Sets output name based on env variable 'OUT'
if (process.env.OUT) argv.output = `search${process.env.OUT}`;
// Set the data field to 'fullTextAndMetadata' based on env variable 'FULL'
const dataField = process.env.FULL ? 'fullTextAndMetadata' : Object.keys(_.pick(argv, Object.keys(FIELDS)))[0];

console.log('Searching for: %s', argv._[0]);
console.log('Between %s and %s', argv.year[0], argv.year[1]);
console.log('Using: %s', FIELDS[dataField] || 'No data fields');

async function search() {
  let results;
  if (argv.scrap) {
    results = await ieee.scrap(addDataField(argv._[0], FIELDS[dataField]), argv.year, argv.verbose);
  } else {
    const configFile = path.join(configDirectory(), 'config.json');
    checkAPIKey(configFile);
    try {
      const config = fs.readJSONSync(configFile); // Read the APIKEY
      results = await ieee.api(config.APIKEY, addDataField(argv._[0], FIELDS[dataField]), argv.year, argv.verbose);
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
