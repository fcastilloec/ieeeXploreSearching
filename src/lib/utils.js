const path = require('node:path');

/**
 * Changes the extension of a filename
 *
 *
 * @param   {string}  filename  The path to the file.
 * @param   {string}  ext       The extension to use.
 *
 * @return  {string}            The new path with the proper extension.
 */
function changeFileExtension(filename, extension) {
  const orgFilename = path.parse(filename);

  return path.format({
    ...orgFilename,
    name: path.basename(orgFilename.base, orgFilename.ext),
    ext: extension.startsWith('.') ? extension : `.${extension}`,
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
function testFileExtension(filename, extension) {
  const temporaryExtension = extension.startsWith('.') ? extension : `.${extension}`;
  return path.parse(filename).ext === temporaryExtension ? filename : filename + temporaryExtension;
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
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Get line and column numbers of errors without a proper stack.
 *
 * @param   {int}  column  The column where the error stack should point to.
 * @returns {string}    A formatted line ready to be added to an error stack.
 */
function getLineStack(column = 0) {
  let error_ = new Error(); // eslint-disable-line unicorn/error-message
  error_ = error_.stack.split('\n')[2].split(/[():]/);
  error_.pop(); error_.shift(); // remove unneeded elements
  return column === 0 ? `    at ${error_.join(':')}` : `    at ${error_[0]}:${error_[1]}:${Number.parseInt(error_[2], 10) + column}`;
}

module.exports = {
  changeFileExtension,
  escapeRegExp,
  getLineStack,
  testFileExtension,
  testYear,
};
