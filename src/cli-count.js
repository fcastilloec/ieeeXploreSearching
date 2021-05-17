#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs-extra');

const { argv } = yargs
  .wrap(null)
  .version(require('../package.json').version)
  .usage('Usage: $0 <filename>')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 'No JSON file specified');

argv._.forEach((filename) => {
  try {
    const file = fs.readJsonSync(filename);
    console.log('Records inside %s: %s', filename, file.length);
  } catch (error) {
    console.error(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }
});
