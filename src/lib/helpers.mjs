import path from 'node:path';

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
 * Test if years are valid.
 *
 * @param   {number[]}  years  The array of years to check with max length of 2.
 *
 * @throws  {TypeError}     Argument has to be an integer.
 * @throws  {RangeError}    Argument has to be between 1900 and current year.
 */
function testYears(years) {
  if (years.length > 2) throw new TypeError(`Only provide up to two years to specify a range (user ${years})`);
  for (const year of years) {
    if (!Number.isInteger(year)) throw new TypeError(`Year has to be an integer (user: ${years})`);
    if (year < 1900) throw new RangeError(`Year has to be after 1900 (user: ${year})`);
    if (year > new Date().getFullYear())
      throw new RangeError(`Year has to be the current year or earlier (user: ${year})`);
  }
}

/**
 * Escapes a string to be used for regex.
 *
 * @param    {string}  string  The string to escape.
 * @returns  {string}          The escaped string.
 */
function escapeRegExp(string) {
  /*
  Find all the following characters: (some are escaped in the final expression)
  .*+?^${}()[]\
  And escapes them, by adding '\' before each of those characters in a string
  The next line won't be tested (issues with coverage and regex)
  */
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Get line and column numbers of errors without a proper stack.
 *
 * @param   {int}  column  The column where the error stack should point to.
 * @returns {string}    A formatted line ready to be added to an error stack.
 */
function getLineStack(column = 0) {
  let error_ = new Error();
  error_ = error_.stack.split('\n')[2].split(/[():]/);
  error_.pop();
  error_.shift(); // remove unneeded elements
  return column === 0 ?
      `    at ${error_.join(':')}`
    : `    at ${error_[0]}:${error_[1]}:${Number.parseInt(error_[2], 10) + column}`;
}

/**
 * Test if query is valid.
 *
 * @param   {string} queryText  The search query.
 *
 * @throws  {RangeError}        There can't be more than two wildcards (*) in a query.
 * @throws  {Error}             If there's a wildcard, it has to be preceded by at least 3 characters
 */
function checkQueryText(queryText) {
  // count wildcards, 'String' function is needed when queryText is a number (i.e. article number)
  const wildcardMatches = String(queryText).match(/\w*\*/g) || [];
  if (wildcardMatches.length > 2) {
    // maximum two wildcards
    throw new RangeError('Query contains more than two wildcards.');
  }

  for (const match of wildcardMatches) {
    if (match.length < 4) {
      // minimum 3 characters + 1 wildcard
      throw new Error(`Wildcard '${match}' does not have at least 3 preceding characters.`);
    }
  }
}

export { changeFileExtension, checkQueryText, escapeRegExp, getLineStack, testFileExtension, testYears };
