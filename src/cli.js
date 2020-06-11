#!/usr/bin/env node
const yargs = require('yargs')
const { fromFile } = require('./lib/json2xls')
const logic = require('./lib/logicOperations')

const argv = yargs
  .version(require('../package').version)
  .wrap(null)
  .strict()
  .alias('help', 'h')
  .group(['help', 'version', 'api'], 'Global options')
  .parserConfiguration({
    'duplicate-arguments-array': false,
    'strip-aliased': true
  })
  .usage('Usage: $0 [command] <options>')
  .option('api', {
    alias: 'a',
    describe: 'Whether the JSON was saved using API searching (instead of scrapping)',
    default: false,
    type: 'boolean'
  })
  .command({
    command: '$0',
    desc: 'Perfom logic operations between JSON files',
    builder: (args) => {
      args
        .option('output', {
          alias: 'o',
          describe: 'Output file of the operation',
          nargs: 1,
          type: 'string',
          demandOption: true
        })
        .option('merge', {
          alias: 'm',
          describe: 'Combines different files into a single one',
          conflicts: ['and', 'or', 'not'],
          type: 'array'
        })
        .option('and', {
          alias: 'A',
          conflicts: ['or'],
          describe: 'Logical AND operator',
          type: 'array'
        })
        .option('or', {
          alias: 'O',
          conflicts: ['and'],
          describe: 'Logical OR operator',
          type: 'array'
        })
        .option('not', {
          alias: 'N',
          describe: 'Logical OR operator',
          nargs: 1,
          type: 'string'
        })
        .option('excel', {
          alias: 'e',
          describe: 'Whether to also save results as excel file',
          default: false,
          type: 'boolean'
        })
        .check(argv => {
          if (argv.merge && argv.merge.length < 2) {
            throw new Error("Error: 'merge' needs at least two files to operate on")
          }
          if (argv.and && argv.and.length < 2) {
            throw new Error("Error: 'and' needs at least two files to operate on")
          }
          if (argv.or && argv.or.length < 2) {
            throw new Error("Error: 'or' needs at least two files to operate on")
          }
          if (argv.not && (!(argv.merge || argv.and || argv.or) && argv._.length !== 1)) {
            throw new Error("Error: 'not' needs any operator (except for merge) or a single input file")
          }
          if (!(argv.merge || argv.and || argv.or || argv.not)) {
            throw new Error('Error: at least one command is needed')
          }
          return true
        })
        .example('$0 --merge file1.json file2.json file3.json --output output.json', 'merge file1.json, file2.json, file3.json and save into output.json')
        .example('$0 --and file1.json file2.json --output output.json', 'file1.json AND file2.json -> output.json')
        .example('$0 --or file1.json file2.json -not file3.json --output output.json', '(file1.json OR file2.json) NOT file3.json -> output.json')
    }
  })
  .command({
    command: 'json2xls <jsonFile> [options]',
    aliases: 'j2x',
    desc: 'Converts a JSON into xls',
    builder: (args) => {
      args
        .positional('jsonFile', {
          describe: 'The JSON file to convert',
          type: 'string'
        })
        .example('$0 json2xls file.json', 'Converts file.json into file.xls')
    }
  })
  .argv

argv.jsonFile ? fromFile(argv.jsonFile, argv.api) : logic(argv)
