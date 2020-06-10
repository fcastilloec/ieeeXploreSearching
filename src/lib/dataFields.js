/**
 * IEEE Data Fields
 */
const FIELDS = {
  fullTextAndMetadata: '"Full Text .AND. Metadata"',
  textOnly: '"Full Text Only"',
  publicationTitle: '"Publication Title"',
  metadata: '"All Metadata"',
  ieeeTerms: '"IEEE Terms"'
}

/**
 * Appends an specific data field to each search term.
 *
 * @param   {string}  querytext  the search string.
 * @param   {string}  field      the data field to append.
 *
 * @return  {string}             the new search string with the data field appended.
 */
function addDataField (querytext, field) {
  if (!field) return querytext

  const operators = ['AND', 'OR', 'NOT']
  const near = new RegExp('O?NEAR/[0-9]*')

  const terms = querytext.split(' ').map(term => {
    if (operators.includes(term) || term.match(near)) return term
    if (term.startsWith('(')) return `(${field}:${term.slice(1)}`
    return `${field}:${term}`
  })
  return terms.join(' ')
}

module.exports = {
  FIELDS,
  addDataField
}
