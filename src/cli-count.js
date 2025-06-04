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
    /* istanbul ignore next */
    const file = readJsonSync(filename);
    if (!Array.isArray(file)) {
      throw new Error('JSON file must contain an array');
    }
    console.log('Records inside %s: %s', filename, file.length);
  } catch (error) {
    console.error(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }
}
