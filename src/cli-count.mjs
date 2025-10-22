#!/usr/bin/env node
import yargs from 'yargs';
import { readJsonSync } from 'fs-extra/esm';
import { redError } from './lib/helpers.mjs';
import pkg_ from '../package.json' with { type: 'json' };

const yargsInstance = yargs(process.argv.slice(2));

const { argv } = yargsInstance
  .wrap(yargsInstance.terminalWidth())
  .version(pkg_.version)
  .usage('Usage: $0 <filename>')
  .strict()
  .alias('help', 'h')
  .demandCommand(1, 'No JSON file specified');

for (const filename of argv._) {
  try {
    const file = readJsonSync(filename);
    console.log('Records inside %s: %s', filename, file.length);
  } catch (error) {
    redError(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }
}
