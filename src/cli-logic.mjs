#!/usr/bin/env node
import { Command, Option } from 'commander';
import fs from 'fs-extra';
import { basename } from 'node:path';
import dotenv from 'dotenv';
import { fromResults } from './lib/json2xls.mjs';
import { logicOperations } from './lib/logic-operations.mjs';
import { changeFileExtension, testFileExtension, redError } from './lib/helpers.mjs';
import pkg_ from '../package.json' with { type: 'json' };

dotenv.config({ quiet: true, path: ['.env', 'env'] }); // read env variables from both '.env' and 'env'

const program = new Command();

program
  .version(pkg_.version)
  .showHelpAfterError()
  .configureOutput({
    outputError: (str, write) => write(redError(str, false)),
  });

program
  .description('Perform logic operations between JSON files')
  .argument('<files...>', 'JSON files to operate on')
  .option('-o, --output <filename>', 'Output file of the operation')
  .addOption(new Option('-A, --and', 'Logical AND operator').conflicts(['or', 'merge']))
  .addOption(new Option('-O, --or', 'Logical OR operator').conflicts(['and', 'merge']))
  .option('-N, --not <filename>', 'Logical NOT operator')
  .option('-e, --excel', 'Whether to also save results as excel file', false)
  .addOption(
    new Option('-m, --merge', 'Combines different files into a single one.\nAlias for OR operator').conflicts([
      'and',
      'or',
    ]),
  )
  .action(logic)
  .addHelpText(
    'after',
    `
Examples:
  $ ${basename(process.argv[1])} --merge file1.json file2.json file3.json --output output.json
    file1.json OR file2.json OR file3.json -> output.json

  $ ${basename(process.argv[1])} --and file1.json file2.json --output output.json
    file1.json AND file2.json -> output.json

  $ ${basename(process.argv[1])} --or file1.json file2.json -not file3.json --output output.json
    (file1.json OR file2.json) NOT file3.json -> output.json
`,
  );

// Command for J2X
program
  .command('json2xls <jsonFile>')
  .alias('j2x')
  .allowExcessArguments()
  .description('Converts a JSON into xls')
  .action(convert)
  .addHelpText(
    'after',
    `
Example:
  $ ${basename(process.argv[1])} json2xls file.json
  Converts file.json into file.xls
`,
  );

program.parse(process.argv);

/**
 * Export a JSON to Excel, used for J2X command
 *
 * @param {string} jsonFile The file to convert to Excel
 */
async function convert(jsonFile) {
  try {
    const json = await fs.readJson(jsonFile);
    await fromResults(json, changeFileExtension(jsonFile, '.xls'));
  } catch (error) {
    redError(`Error converting JSON file:\n${error.message}`);
    process.exit(4);
  }
}

/**
 * Run logic operations
 *
 * @param {string[]} files  an array of files to work on
 * @param {Object}   opts   the Commander options object
 */
async function logic(files, opts) {
  if (!opts.output) {
    program.error("error: required option '-o, --output <filename>' not specified");
  }
  // Checks on options and arguments
  if (!(opts.merge || opts.and || opts.or || opts.not)) {
    program.error('error: at least one command option is needed');
  }
  if ((opts.merge || opts.and || opts.or) && files.length < 2) {
    program.error('error: command needs at least two files to operate on');
  }
  if (opts.not && !(opts.merge || opts.and || opts.or) && files.length !== 1) {
    program.error('error: operator NOT by itself requires only one additional file to operate on');
  }

  // Run the operations
  const result = logicOperations({ ...opts, files });
  if (result.length === 0) {
    console.log('Logic operation returned zero results. No files will be saved.');
    process.exit(0);
  }
  console.log('Operation returned %s results', result.length);
  try {
    await fs.ensureFile(testFileExtension(opts.output, '.json')); // create the parent directory if it doesn't exist
    await fs.writeJson(testFileExtension(opts.output, '.json'), result, {
      spaces: 1,
    });
    if (opts.excel) await fromResults(result, testFileExtension(opts.output, '.xls'));
  } catch (error) {
    redError(`Error writing JSON or XLS file:\n${error.message}`);
    process.exit(4);
  }
}
