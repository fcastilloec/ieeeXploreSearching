#!/usr/bin/env node
const yargs = require('yargs')
const fs = require('fs-extra')

const argv = yargs
  .wrap(null)
  .version(require('../package').version)
  .usage('Usage: $0 <filename>')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 1, 'No JSON file specified', 'Specify only one JSON file')
  .argv

try {
  const file = fs.readJsonSync(argv._[0])
  console.log('Records inside file: %s', file.length)
} catch (error) {
  console.error('Error reading JSON file:\n' + error.message)
  process.exit(5)
}
