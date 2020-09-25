const path = require('path');

/**
 * Checks if filename has a proper extension, otherwise adds it (doesn't change it)
 *
 * @param   {string}  filename  The path to the file.
 * @param   {string}  ext       The extension to compare.
 *
 * @return  {string}            The new path with the proper extension.
 */
function changeFileExtension(filename, ext) {
  const tmpExt = ext.startsWith('.') ? ext : `.${ext}`;
  return path.parse(filename).ext === tmpExt ? filename : filename + tmpExt;
}

/**
 * Test if year cli option is valid.
 *
 * @param   {number}  year  The number to check if it's valid.
 *
 * @throws  {TypeError}     Argument has to be an integer.
 * @throws  {RangeError}    Argument has to be between 1900 and current year.
 */
function testYear(year) {
  if (!Number.isInteger(year)) throw new TypeError('Year has to be an integer');
  if (year < 1900) throw new RangeError('Year option has to be after 1900');
  if (year > new Date().getFullYear()) throw new RangeError('Year option has to be before current year');
}

module.exports = {
  changeFileExtension,
  testYear,
};
