#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs-extra');
const { fromResults } = require('./lib/json2xls');
const { logicOperations } = require('./lib/logic-operations');
const { changeFileExtension, testFileExtension } = require('./lib/helpers');

const { argv } = yargs
  .version(require('../package.json').version)
  .wrap(yargs.terminalWidth())
  .alias('help', 'h')
  .group(['help', 'version'], 'Global options')
  .parserConfiguration({
    'duplicate-arguments-array': false,
    'boolean-negation': false,
    'strip-aliased': true,
  })
  .strictOptions()
  .usage('Usage: $0 [command] <options>')
  .command({
    command: '$0',
    desc: 'Perform logic operations between JSON files',
    builder: (arguments_) => {
      arguments_
        .option('output', {
          alias: 'o',
          describe: 'Output file of the operation',
          nargs: 1,
          type: 'string',
          demandOption: true,
        })
        .option('merge', {
          alias: 'm',
          describe: 'Combines different files into a single one',
          conflicts: ['and', 'or'],
          type: 'boolean',
        })
        .option('and', {
          alias: 'A',
          conflicts: ['or', 'merge'],
          describe: 'Logical AND operator',
          type: 'boolean',
        })
        .option('or', {
          alias: 'O',
          conflicts: ['and', 'merge'],
          describe: 'Logical OR operator',
          type: 'boolean',
        })
        .option('not', {
          alias: 'N',
          describe: 'Logical NOT operator',
          nargs: 1,
          type: 'string',
        })
        .option('excel', {
          alias: 'e',
          describe: 'Whether to also save results as excel file',
          default: false,
          type: 'boolean',
        })
        .check((argument) => {
          if (!(argument.merge || argument.and || argument.or || argument.not)) {
            throw new Error('At least one command is needed');
          }
          if ((argument.merge || argument.and || argument.or) && argument._.length < 2) {
            throw new Error('Command needs at least two files to operate on');
          }
          if (argument.not && !(argument.merge || argument.and || argument.or) && argument._.length !== 1) {
            throw new Error('Operator NOT by itself requires only one additional file to operate on');
          }
          return true;
        })
        .example(
          '$0 --merge file1.json file2.json file3.json --output output.json',
          'file1.json OR file2.json OR file3.json -> output.json',
        )
        .example('$0 --and file1.json file2.json --output output.json', 'file1.json AND file2.json -> output.json')
        .example(
          '$0 --or file1.json file2.json -not file3.json --output output.json',
          '(file1.json OR file2.json) NOT file3.json -> output.json',
        );
    },
  })
  .command({
    command: 'json2xls <jsonFile>',
    aliases: 'j2x',
    desc: 'Converts a JSON into xls',
    builder: (arguments_) => {
      arguments_
        .strict()
        .positional('jsonFile', {
          describe: 'The JSON file to convert',
          type: 'string',
        })
        .example('$0 json2xls file.json', 'Converts file.json into file.xls');
    },
  });

async function convert() {
  try {
    const json = await fs.readJson(argv.jsonFile);
    await fromResults(json, changeFileExtension(argv.jsonFile, '.xls'));
  } catch (error) {
    console.error(`Error converting JSON file:\n${error.message}`);
    process.exit(4);
  }
}

async function logic() {
  const result = logicOperations(argv);
  if (result.length === 0) {
    console.log('Logic operation returned zero results. No files will be saved.');
    process.exit(0);
  }

  console.log('Operation returned %s results', result.length);
  try {
    await fs.ensureFile(testFileExtension(argv.output, '.json')); // create the parent directory if it doesn't exist
    await fs.writeJson(testFileExtension(argv.output, '.json'), result, { spaces: 1 });
    if (argv.excel) await fromResults(result, testFileExtension(argv.output, '.xls'));
  } catch (error) {
    console.error(`Error writing JSON or XLS file:\n${error.message}`);
    process.exit(4);
  }
}

argv.jsonFile
  ? convert() // Converts JSON to XLS
  : logic(); // Run logic operations on JSON files
