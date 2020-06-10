#!/usr/bin/env node
const _ = require('lodash')
const fs = require('fs-extra')
const yargs = require('yargs')
const { filename, queryForScrap, yearRange } = require('./lib/utils')
const { FIELDS, addDataField } = require('./lib/dataFields')
const ieee = require('./lib/ieeeAPI')
const json2xls = require('./lib/json2xls')

const { APIKEY } = process.env

const argv = yargs
  .wrap(null)
  .version(require('../package').version)
  .usage('Usage: $0 <query> [options] [IEEE Data Fields]')
  .strict()
  .alias('v', 'version')
  .alias('h', 'help')
  .demandCommand(1, 1, 'No search query specified')
  .option('output', {
    alias: 'o',
    describe: 'Filename where to save results as JSON',
    nargs: 1,
    type: 'string',
    demandOption: true
  })
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
  .option('api', {
    alias: 'a',
    describe: 'Whether to use the IEEE API or scrapping',
    default: false,
    type: 'boolean'
  })
  .check(argv => {
    if (argv.year.length > 2) throw new Error('Only start and/or finish year are accepted')
    if (Array.isArray(argv.year)) {
      for (let i = 0; i < 2; i++) {
        if (!Number.isInteger(argv.year[i])) throw new Error('Year has to be a integer')
        if (argv.year[i].toString().length !== 4) throw new Error('Year has to be a 4 digit integer')
        if (argv.year[i] < 1900 || argv.year[i] > new Date().getFullYear()) throw new Error('Year has to be after 1900 and before current one')
      }
    } else {
      if (!Number.isInteger(argv.year)) throw new Error('Year has to be a integer')
      if (argv.year.toString().length !== 4) throw new Error('Year has to be a 4 digit integer')
      if (argv.year < 1900 || argv.year > new Date().getFullYear()) throw new Error('Year has to be after 1900 and before current one')
    }
    if (argv.api && !APIKEY) throw new Error('No API key provided. Provide one by setting APIKEY enviroment variable')
    return true
  })
  .group(['full-text-and-metadata', 'text-only', 'publication-title', 'metadata', 'ieee-terms'], 'IEEE Data Fields')
  .example('$0 "optics AND nano" -o search1 -y 1990 -y 2000 -e', 'searches for "optics AND nano" between 1990-2000 and save the results in search1.json and search1.xls')
  .example('$0 "h264 NEAR/3 cellular" -y 2005 -o search2.json', 'searches for "h264 NEAR/3 cellular" from 2005 to date, and save the results in search2.json')
  .argv

const dataField = Object.keys(_.pick(argv, Object.keys(FIELDS)))[0]
const rangeYear = yearRange(argv.year)

console.log('Searching for: %s', argv._[0])
console.log('Between %s and %s', rangeYear[0], rangeYear[1])
console.log('Using: %s', FIELDS[dataField] || 'No data fields')

/**
 * Start searching with scrapping and save the results into JSON (and excel if required)
 */
async function searchScrap () {
  const query = queryForScrap(argv._[0], rangeYear, FIELDS[dataField])
  const results = await ieee.scrap(query)
  console.log('Found %s results.', results.length)

  if (results.length > 0) await save(results) // Exit if there's no results
}

/**
 * Start searching with API and save the results into JSON (and excel if required)
 */
async function searchApi () {
  const results = await ieee.api(APIKEY, addDataField(argv._[0], dataField), rangeYear[0], rangeYear[1])
  console.log('Found %s results.', results.total_records)

  if (results.total_records > 0) await save(results.articles) // Exit if there's no results
}

async function save (results) {
  try {
    await fs.ensureFile(filename(argv.output, '.json')) // create the parent directory if they don't exist
    await fs.writeJson(filename(argv.output + 'API', '.json'), results.articles, { spaces: 1 })
    if (argv.excel) json2xls.fromAPI(results.articles, filename(argv.output, '.xls'))
  } catch (error) {
    console.error('\n' + error.message)
    process.exit(1)
  }
}

argv.api ? searchApi() : searchScrap()
