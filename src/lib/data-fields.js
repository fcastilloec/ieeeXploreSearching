/**
 * IEEE Data Fields
 */
const FIELDS = {
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
  return queryText.toString().split(operators).map((term) => {
    if (operators.test(term) || term === '') return term; // checks if it's an IEEE operator, parenthesis or empty
    return `${field}:${term}`;
  }).join('');
}

module.exports = {
  FIELDS,
  addDataField,
};
