#!/usr/bin/env node
const yargs = require('yargs');
const { readJsonSync } = require('fs-extra');

const { argv } = yargs
  .wrap(yargs.terminalWidth())
  .version(require('../package.json').version)
  .usage('Usage: $0 <filename>')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 'No JSON file specified');

for (const filename of argv._) {
  try {
    const file = readJsonSync(filename);
    console.log('Records inside %s: %s', filename, file.length);
  } catch (error) {
    console.error(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }
}
