const path = require('path');

/**
 * Changes the extension of a filename
 *
 * @param   {string}  filename  The path to the file.
 * @param   {string}  ext       The extension to use.
 *
 * @return  {string}            The new path with the proper extension.
 */
function changeFileExtension(filename, ext) {
  return path.format({
    ...path.parse(filename),
    ext: ext.startsWith('.') ? ext : `.${ext}`,
    base: undefined,
  });
}

/**
 * Check if start and end year where supplied. Otherwise search until current year.
 *
 * @param   {number|number[]}  year  year or range of years to search
 *
 * @return  {number[]}        The range of years
 */
function yearRange(year) {
  return Array.isArray(year) ? year : [year, new Date().getFullYear()];
}

module.exports = {
  changeFileExtension,
  yearRange,
};
