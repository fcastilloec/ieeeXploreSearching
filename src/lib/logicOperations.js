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
/* istanbul ignore next */
function logicOperations(options) {
  let result = [];

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
    // Read NOT file if not used in combination with other operators
    if (options._[0]) result = fs.readJsonSync(options._[0]);
    result = _.differenceWith(result, file, isEqual);
  }

  return result;
}

module.exports = {
  logicOperations,
  isEqual,
};
