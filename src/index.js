#!/usr/bin/env node
const fs = require('fs-extra')
const yargs = require('yargs')
const dataFields = require('./lib/dataFields')
const { filename } = require('./lib/utils')
const ieee = require('./lib/ieeeAPI')
const json2xls = require('./lib/json2xls')

const argv = yargs
  .wrap(null)
  .version(require('../package').version)
  .usage('Usage: $0 <query> <filename[.json]>')
  .strict()
  .alias('v', 'version')
  .alias('h', 'help')
  .option('full-text-and-metadata', {
    alias: 'f',
    conflicts: ['text-only', 'publication-title', 'metadata', 'ieee-terms'],
    describe: 'Searches for "Full Text & Metadata"',
    type: 'boolean'
  })
  .option('text-only', {
    alias: 't',
    conflicts: ['full-text-and-metadata', 'publication-title', 'metadata', 'ieee-terms'],
    describe: 'Searches for "Full Text Only"',
    type: 'boolean'
  })
  .option('publication-title', {
    alias: 'p',
    conflicts: ['text-only', 'full-text-and-metadata', 'metadata', 'ieee-terms'],
    describe: 'Searches for "Publication Title"',
    type: 'boolean'
  })
  .option('metadata', {
    alias: 'm',
    describe: 'Searches for "All Metadata"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'ieee-terms'],
    type: 'boolean'
  })
  .option('ieee-terms', {
    alias: 'i',
    describe: 'Searches for "IEEE Terms"',
    conflicts: ['text-only', 'full-text-and-metadata', 'publication-title', 'metadata'],
    type: 'boolean'
  })
  .option('excel', {
    alias: 'e',
    describe: 'Whether to also save results as excel file in addition to JSON',
    default: false,
    type: 'boolean'
  })
  .option('year', {
    alias: 'y',
    nargs: 1,
    demandOption: true,
    describe: 'Year range to search. A single value will search from "year" to date',
    type: 'number'
  })
  .check(argv => {
    if (argv._.length !== 2) throw new Error('The program needs a query and a filename to work.')
    if (argv.year.length > 2) throw new Error('Only start and/or finish year range is accepted.')
    for (let i = 0; i < argv.year.length; i++) {
      if (isNaN(argv.year[i])) throw new Error('Year has to be a integer.')
    }
    return true
  })
  .example('$0 "optics AND nano" search1 -y 1990 -y 2000', 'searches for "optics AND nano" between 1990-2000 and save the results in search1.json and search1.xls')
  .example('$0 "h264 NEAR/3 cellular" -y 2005 search2 ', 'searches for "h264 NEAR/3 cellular" from 2005 to date, and save the results in search2.json and search2.xls')
  .argv

let query // The search query
let field // The field used

// Appends the required data field based on the user option.
switch (true) {
  case argv['full-text-and-metadata']:
    query = dataFields.fullTextAndMetadata(argv._[0])
    field = '"Full Text .AND. Metadata"'
    break
  case argv['text-only']:
    query = dataFields.textOnly(argv._[0])
    field = '"Full Text Only"'
    break
  case argv['publication-title']:
    query = dataFields.publication(argv._[0])
    field = '"Publication Title"'
    break
  case argv.metadata:
    query = dataFields.metadata(argv._[0])
    field = '"All Metadata"'
    break
  case argv['ieee-terms']:
    query = dataFields.ieeeTerms(argv._[0])
    field = '"IEEE Terms"'
    break
  default:
    query = argv._[0]
    field = ''
    break
}

// Outputs the search query and any data fields being used
console.log('Searching for:\n%s', argv._[0])
console.log('Using: %s', field)

// Encodes the URL so it can be used by a browser
query = encodeURI(query).replace(/\?/g, '%3F').replace(/\//g, '%2F')
query = `(${query})` // needed when multiple search terms are used

// Check if start and end year where supplied. Otherwise search until current year.
Array.isArray(argv.year)
  ? query += `&ranges=${argv.year[0]}_${argv.year[1]}_Year`
  : query += `&ranges=${argv.year}_${new Date().getFullYear()}_Year`

/**
 * Call the search function (either scrapping or API) and save the results into JSON (and excel if required)
 *
 * @param   {string}  queryText  The query text to search
 */
async function search (queryText) {
  try {
    const results = await ieee.scrapResults(query)
    console.log('Found %s results.', results.length)

    await fs.writeJson(filename(argv._[1], '.json'), results, { spaces: 1 })
    if (argv.excel) json2xls(results, filename(argv._[1], '.xls'))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

search(query)
