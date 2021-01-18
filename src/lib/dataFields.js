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

  // test for multiple parentheses followed by any chars. The name of the captured group is specified in '?<name>'
  const parenthesis = /(?<paren>\(+)(?<term>.+)/;
  const operators = /O?NEAR(\/[0-9])*|AND|OR|NOT/; // IEEE search operators
  let phrase = false; // for checking if we're inside a multi-word phrase (a phrase is surrounded by double quotes)

  return queryText.toString().split(' ').map((term) => {
    if (term.match(operators)) return term; // checks if it's an IEEE operator
    if (phrase) { // check if we're in the middle of a multi-word phrase
      if (term.endsWith('"')) phrase = false; // record the end of a phrase. Nested phrases aren't checked for
      return term;
    }
    // Check for the start of a multi-word phrase, single double-quoted words are managed like any other term
    if (term.startsWith('"') && !term.endsWith('"')) phrase = true;

    // Test for matching search groups (terms starting with parentheses)
    // If test returns null, the default group with and empty 'paren' will be used
    const { groups } = term.match(parenthesis) || { groups: { paren: '', term } };
    return `${groups.paren}${field}:${groups.term}`;
  }).join(' ');
}

module.exports = {
  FIELDS,
  addDataField,
};
