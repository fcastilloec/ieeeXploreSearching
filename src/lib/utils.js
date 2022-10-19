const path = require('path');

/**
 * Changes the extension of a filename
 *
 *
 * @param   {string}  filename  The path to the file.
 * @param   {string}  ext       The extension to use.
 *
 * @return  {string}            The new path with the proper extension.
 */
function changeFileExtension(filename, ext) {
  const orgFilename = path.parse(filename);

  return path.format({
    ...orgFilename,
    name: path.basename(orgFilename.base, orgFilename.ext),
    ext: ext.startsWith('.') ? ext : `.${ext}`,
    base: undefined,
  });
}

/**
 * Checks if filename has a proper extension, otherwise adds it (doesn't change it)
 *
 * @param   {string}  filename  The path to the file.
 * @param   {string}  ext       The extension to compare.
 *
 * @return  {string}            The new path with the proper extension.
 */
function testFileExtension(filename, ext) {
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

/**
 * Escapes a string to be used for regex.
 *
 * @param    {string}  string  The string to escape.
 * @returns  {string}          The escaped string.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get line and column numbers of errors without a proper stack.
 *
 * @param   {int}  column  The column where the error stack should point to.
 * @returns {string}    A formatted line ready to be added to an error stack.
 */
function getLineStack(column = 0) {
  let e = new Error();
  e = e.stack.split('\n')[2].split(/[():]/);
  e.pop(); e.shift(); // remove unneeded elements
  return column === 0 ? `    at ${e.join(':')}` : `    at ${e[0]}:${e[1]}:${parseInt(e[2], 10) + column}`;
}

module.exports = {
  changeFileExtension,
  escapeRegExp,
  getLineStack,
  testFileExtension,
  testYear,
};
