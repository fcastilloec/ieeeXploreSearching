const path = require('path')
const { addDataField } = require('./dataFields')

/**
 * Make sure the filename has the correct extension
 *
 * @param   {string}  filepath  The path with the filename
 * @param   {string}  ext       The extension to use
 *
 * @return  {string}            The path with the filename with the proper extension
 */
function filename (filepath, ext) {
  if (!ext.startsWith('.')) ext = `.${ext}`
  const file = path.parse(filepath)
  return path.join(file.dir, file.name + ext)
}

/**
 * Check if start and end year where supplied. Otherwise search until current year.
 *
 * @param   {number|number[]}  year  year or range of years to search
 *
 * @return  {number[]}        The range of years
 */
function yearRange (year) {
  return Array.isArray(year) ? year : [year, new Date()]
}

/**
 * [queryForScrap description]
 *
 * @param   {[type]}  querytext  [querytext description]
 * @param   {[type]}  rangeYear  [rangeYear description]
 * @param   {[type]}  field      [field description]
 *
 * @return  {[type]}             [return description]
 */
function queryForScrap (querytext, rangeYear, field) {
  // Appends the required data field based on the user option.
  let query = addDataField(querytext, field)

  // Encodes the URL so it can be used by a browser, and adds parenthesis
  query = `(${encodeURI(query).replace(/\?/g, '%3F').replace(/\//g, '%2F')})`
  query += `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`

  return query
}

module.exports = {
  filename,
  yearRange,
  queryForScrap
}
