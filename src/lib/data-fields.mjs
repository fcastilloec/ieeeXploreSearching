/**
 * IEEE Data Fields
 */
const FIELDS = {
  abstract: '"Abstract"',
  documentTitle: '"Document Title"',
  fullTextAndMetadata: '"Full Text .AND. Metadata"',
  ieeeTerms: '"IEEE Terms"',
  metadata: '"All Metadata"',
  publicationTitle: '"Publication Title"',
  textOnly: '"Full Text Only"',
};

/**
 * Appends an specific data field to each search term.
 *
 * @param   {string}  queryText  the search string.
 * @param   {string}  field      the data field to append.
 *
 * @return  {string}             the new search string with the data field appended.
 */
function addDataField(queryText, field) {
  if (!field) return queryText;

  const operators = /( O?NEAR[/0-9]* | AND | OR | NOT |[()]+)/g; // IEEE search operators and parenthesis
  return queryText
    .toString()
    .split(operators)
    .map((term) => {
      if (operators.test(term) || term === '') return term; // checks if it's an IEEE operator, parenthesis or empty
      return `${field}:${term}`;
    })
    .join('');
}

/**
 * Checks if a query string already has IEEE fields.
 *
 * @param   {string}  queryText   the search string.
 * @returns {boolean}             if the search string contains a FIELD or not.
 */
function queryContainsField(queryText) {
  for (const fieldValue of Object.values(FIELDS)) {
    if (queryText.toString().includes(fieldValue)) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {string} argument   the argument to remove from the array.
 * @returns {string[]}  a new array without the string.
 */
function removeConflict(argument) {
  return Object.keys(FIELDS).filter((field) => field !== argument);
}

export { FIELDS, removeConflict, addDataField, queryContainsField };
