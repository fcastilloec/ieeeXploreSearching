const _ = require('lodash');
const fs = require('fs-extra');
const { changeFileExtension } = require('./utils');
const { fromResults } = require('./json2xls');

/**
 * Compares if array elements (results) are equal. Scrapping ONLY
 *
 * @param   {object}  value  The result to compare
 * @param   {object}  other  The other result to compare
 *
 * @return  {boolean}        Returns true if both results are equal based on document number, or title and year
 */
function isEqual(value, other) {
  if (value.article_number && other.article_number) return value.article_number === other.article_number;
  return (value.title === other.title)
    && (value.publication_year === other.publication_year)
    && (value.content_type === other.content_type)
    && (value.publisher === other.publisher);
}

/**
 * Perfom any of the logic operations among JSON files and saves them
 * The supported operations are AND, OR, NOT, MERGE
 *
 * @param   {object}  options  The options passed from command-line
 */
function operations(options) {
  let result;

  try {
    // MERGE or OR
    if ('merge' in options || 'or' in options) {
      const files = (options.merge || options.or).map((file) => fs.readJsonSync(file));
      result = _.unionWith(...files, isEqual);
    }

    // AND
    if ('and' in options) {
      const files = options.and.map((file) => fs.readJsonSync(file));
      result = _.intersectionWith(...files, isEqual);
    }

    // NOT
    if ('not' in options) {
      const file = fs.readJsonSync(options.not);
      if (options._[0]) result = fs.readJsonSync(options._[0]);
      result = _.differenceWith(result, file, isEqual);
    }
  } catch (error) {
    throw new Error(`Error reading JSON file:\n${error.message}`);
  }

  if (result.length > 0) {
    console.log('Operation returned %s results', result.length);
    try {
      fs.writeJsonSync(changeFileExtension(options.output, '.json'), result, { spaces: 1 });
    } catch (error) {
      throw new Error(`Error writing JSON file:\n${error.message}`);
    }
    if (options.excel) fromResults(result, changeFileExtension(options.output, '.xls'));
  } else {
    console.log('Logic operation returned zero results. No files will be saved.');
  }
}

module.exports = operations;
