#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readJsonSync } from 'fs-extra/esm';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yargsInstance = yargs(hideBin(process.argv));

const { argv } = yargsInstance
  .wrap(yargsInstance.terminalWidth())
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
