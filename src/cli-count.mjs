#!/usr/bin/env node
import { Command } from 'commander';
import { readJsonSync } from 'fs-extra/esm';
import { redError } from './lib/helpers.mjs';
import pkg_ from '../package.json' with { type: 'json' };

const program = new Command();

program
  .showHelpAfterError()
  .configureOutput({
    outputError: (str, write) => write(redError(str, false)),
  })
  .description('Count the number of results in a JSON file')
  .argument('<filename...>', 'JSON file(s) to read') // require at least one filename
  .version(pkg_.version);

program.parse(process.argv);

for (const filename of program.args) {
  try {
    const file = readJsonSync(filename);
    console.log('Records inside %s: %s', filename, file.length);
  } catch (error) {
    redError(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }
}
