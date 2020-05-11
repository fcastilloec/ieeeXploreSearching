#!/usr/bin/env node

const yargs = require('yargs')

const argv = yargs
  .version(require('../package').version)
  .usage('Usage: ieee <options> <files>')
  .strict()
  .alias('v', 'version')
  .alias('h', 'help')
  .option('output', {
    alias: 'o',
    describe: 'Output file of the operation',
    nargs: 1,
    demandOption: true
  })
  .option('merge', {
    alias: 'm',
    describe: 'Combines different files into a single one',
    type: 'array'
  })
  .option('and', {
    alias: 'A',
    describe: 'Logical AND operator',
    type: 'array'
  })
  .option('or', {
    alias: 'O',
    describe: 'Logical OR operator',
    type: 'array'
  })
  .option('not', {
    alias: 'N',
    describe: 'Logical OR operator',
    nargs: 1,
    type: 'array'
  })
  .check(argv => {
    if (argv.merge && (argv.and || argv.and || argv.not)) {
      throw new Error("Error: 'merge' can't be combine with other commands")
    }
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
    if (argv.or && argv.or.length < 2) {
      throw new Error("Error: 'or' needs at least two files to operate on")
    }
    if (!(argv.merge || argv.and || argv.or || argv.not)) {
      throw new Error('Error: at least one command is needed')
    }
    return true
  })
  .example('$0 --merge file1.json file2.json file3.json --output output.json', 'merge file1.json, file2.json, file3.json and save result into output.json')
  .example('$0 --and file1.json file2.json --output output.json', 'file1.json AND file2.json -> output.json')
  .example('$0 --or file1.json file2.json -not file3.json --output output.json', '(file1.json OR file2.json) NOT file3.json -> output.json')
  .argv

console.log(argv)
