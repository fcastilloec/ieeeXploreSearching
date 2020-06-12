const path = require('path')

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
  return Array.isArray(year) ? year : [year, new Date().getFullYear()]
}

module.exports = {
  filename,
  yearRange
}
