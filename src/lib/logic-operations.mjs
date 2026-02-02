import _ from 'lodash';
import { readJsonSync } from 'fs-extra/esm';
import { redError } from './helpers.mjs';

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
  return (
    value.title === other.title &&
    Number.parseInt(value.publication_year, 10) === Number.parseInt(other.publication_year, 10) &&
    value.content_type === other.content_type &&
    value.publisher === other.publisher
  );
}

/**
 * Perform any of the logic operations among JSON files and saves them
 * The supported operations are AND, OR, NOT, MERGE
 *
 * @param   {object}  options  The options passed from command-line
 */
/* istanbul ignore next */
function logicOperations(options) {
  let result = [];
  let files;

  try {
    files = options.files.map((file) => readJsonSync(file));
  } catch (error) {
    redError(`Error reading JSON file:\n${error.message}`);
    process.exit(4);
  }

  // MERGE or OR
  if (options.merge || options.or) result = _.unionWith(...files, isEqual);

  // AND
  if (options.and) result = _.intersectionWith(...files, isEqual);

  // NOT
  if (options.not) {
    let notFile;
    try {
      notFile = readJsonSync(options.not);
    } catch (error) {
      redError(`Error reading JSON file:\n${error.message}`);
      process.exit(4);
    }
    console.log(`Excluding content from: ${options.not}`);
    result =
      options.merge || options.or || options.and ?
        _.differenceWith(result, notFile, isEqual) // use previous results
      : _.differenceWith(...files, notFile, isEqual); // only use provided files
  }

  return result;
}

export { logicOperations, isEqual };
