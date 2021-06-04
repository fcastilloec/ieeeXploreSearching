const _ = require('lodash');
const fs = require('fs-extra');

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
    && (parseInt(value.publication_year, 10) === parseInt(other.publication_year, 10))
    && (value.content_type === other.content_type)
    && (value.publisher === other.publisher);
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
    files = options._.map((file) => fs.readJsonSync(file));
  } catch (error) {
    console.error(`Error reading JSON file:\n${error.message}`);
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
      notFile = fs.readJsonSync(options.not);
    } catch (error) {
      console.error(`Error reading JSON file:\n${error.message}`);
      process.exit(4);
    }
    result = options.merge || options.or || options.and
      ? _.differenceWith(result, notFile, isEqual) // use previous results
      : _.differenceWith(...files, notFile, isEqual); // only use provided files
  }

  return result;
}

module.exports = {
  logicOperations,
  isEqual,
};
