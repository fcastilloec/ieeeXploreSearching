/**
 * IEEE Data Fields
 */
const FIELDS = {
  documentTitle: '"Document Title"',
  fullTextAndMetadata: '"Full Text .AND. Metadata"',
  textOnly: '"Full Text Only"',
  publicationTitle: '"Publication Title"',
  metadata: '"All Metadata"',
  ieeeTerms: '"IEEE Terms"',
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
    if (queryText.includes(fieldValue)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  FIELDS,
  addDataField,
  queryContainsField,
};
