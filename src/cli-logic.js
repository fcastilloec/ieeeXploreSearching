#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs-extra');
const _ = require('lodash');
const { fromResults } = require('./lib/json2xls');
const { logicOperations } = require('./lib/logicOperations');
const { changeFileExtension } = require('./lib/utils');

const { argv } = yargs
  .version(require('../package').version)
  .wrap(null)
  .alias('help', 'h')
  .group(['help', 'version'], 'Global options')
  .parserConfiguration({
    'duplicate-arguments-array': false,
    'boolean-negation': false,
    'strip-aliased': true,
  })
  .usage('Usage: $0 [command] <options>')
  .command({
    command: '$0',
    desc: 'Perfom logic operations between JSON files',
    builder: (args) => {
      args
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
          describe: 'Logical OR operator',
          nargs: 1,
          type: 'string',
        })
        .option('excel', {
          alias: 'e',
          describe: 'Whether to also save results as excel file',
          default: false,
          type: 'boolean',
        })
        .check((arg, options) => {
          const unknownOptions = _.difference(Object.keys(arg), Object.keys(options).concat(['_', '$0']));
          if (unknownOptions.length) {
            throw new Error(`Unrecognized ${unknownOptions.join(', ')} option`);
          }
          if (!(arg.merge || arg.and || arg.or || arg.not)) {
            throw new Error('At least one command is needed');
          }
          if ((arg.merge || arg.and || arg.or) && arg._.length < 2) {
            throw new Error('Command needs at least two files to operate on');
          }
          if (arg.not && !(arg.merge || arg.and || arg.or) && arg._.length !== 1) {
            throw new Error('Operator NOT by itself requires only one additional file to operate on');
          }
          return true;
        })
        .example(
          '$0 --merge file1.json file2.json file3.json --output output.json',
          'merge file1.json, file2.json, file3.json and save into output.json',
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
    builder: (args) => {
      args
        .strict()
        .positional('jsonFile', {
          describe: 'The JSON file to convert',
          type: 'string',
        })
        .example('$0 json2xls file.json', 'Converts file.json into file.xls');
    },
  });

async function logic() {
  const result = logicOperations(argv);
  if (result.length > 0) {
    console.log('Operation returned %s results', result.length);
    await fs.writeJson(changeFileExtension(argv.output, '.json'), result, { spaces: 1 });
    if (argv.excel) await fromResults(result, changeFileExtension(argv.output, '.xls'));
  } else if (result.length === 0) {
    console.log('Logic operation returned zero results. No files will be saved.');
  }
}

argv.jsonFile
  ? fromResults(fs.readJsonSync(argv.jsonFile), changeFileExtension(argv.output, '.xls'))
  : logic();
