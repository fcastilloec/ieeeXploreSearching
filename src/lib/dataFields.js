/**
 * Appends an specific data field to each search term.
 *
 * @private
 *
 * @param   {string}  querytext  the search string.
 * @param   {string}  field      the data field to append.
 *
 * @return  {string}             the new search string with the data field appended.
 */
function addDataField (querytext, field) {
  const operators = ['AND', 'OR', 'NOT']
  const near = new RegExp('O?NEAR/[0-9]*')

  const terms = querytext.split(' ').map(term => {
    if (operators.includes(term) || term.match(near)) return term
    if (term.startsWith('(')) return `(${field}:${term.slice(1)}`
    return `${field}:${term}`
  })
  return terms.join(' ')
}

/**
 * Searchs all Full Text & Metadata.
 *
 * @param   {string}  querytext  the search string.
 *
 * @return  {string}             the new search string.
 */
function fullTextAndMetadata (querytext) {
  // const textAndMetadata = '"Full Text & Metadata"'
  const textAndMetadata = '"Full Text .AND. Metadata"'
  return addDataField(querytext, textAndMetadata)
}

/**
 * Searchs all Full Text Only.
 *
 * @param   {string}  querytext  the search string.
 *
 * @return  {string}             the new search string.
 */
function textOnly (querytext) {
  return addDataField(querytext, '"Full Text Only"')
}

/**
 * Searchs all IEEE Terms.
 *
 * @param   {string}  querytext  the search string.
 *
 * @return  {string}             the new search string.
 */
function ieeeTerms (querytext) {
  return addDataField(querytext, '"IEEE Terms"')
}

/**
 * Searchs all Metadata.
 *
 * @param   {string}  querytext  the search string.
 *
 * @return  {string}             the new search string.
 */
function metadata (querytext) {
  return addDataField(querytext, '"All Metadata"')
}

/**
 * Searchs only publication title
 *
 * @param   {string}  querytext  the search string.
 *
 * @return  {string}             the new search string.
 */
function publication (querytext) {
  const pubTitle = '"Publication Title"'
  if (querytext.startsWith('(')) return `(${pubTitle}:${querytext.slice(1)}`

  return `${pubTitle}:${querytext}`
}

module.exports = {
  textOnly,
  fullTextAndMetadata,
  ieeeTerms,
  metadata,
  publication
}
