const _ = require('lodash')
const fs = require('fs-extra')
const { filename } = require('./utils')
const json2xls = require('./json2xls')

/**
 * Perfom any of the logic operations among JSON files and saves them
 * The supported operations are AND, OR, NOT, MERGE
 *
 * @param   {object}  options  The options passed from command-line
 */
function operations (options) {
  let result

  try {
    // MERGE or OR
    if (Object.prototype.hasOwnProperty.call(options, 'merge') || Object.prototype.hasOwnProperty.call(options, 'or')) {
      const files = (options.merge || options.or).map(file => fs.readJsonSync(file))
      result = _.unionWith(...files, _.isEqual)
    }

    // AND
    if (Object.prototype.hasOwnProperty.call(options, 'and')) {
      const files = options.and.map(file => fs.readJsonSync(file))
      result = _.intersectionWith(...files, _.isEqual)
    }

    // NOT
    if (Object.prototype.hasOwnProperty.call(options, 'not')) {
      const file = fs.readJsonSync(options.not)
      if (options._[0]) result = fs.readJsonSync(options._[0])
      result = _.differenceWith(result, file, _.isEqual)
    }
  } catch (error) {
    console.error('Error reading JSON file:\n' + error.message)
    process.exit(5)
  }

  try {
    fs.writeJsonSync(filename(options.output, '.json'), result, { spaces: 1 })
  } catch (error) {
    console.error('Error writing JSON file:\n' + error.message)
    process.exit(6)
  }
  const outputfile = filename(options.output, '.xls')
  if (options.excel) options.api ? json2xls.fromAPI(result, outputfile) : json2xls.fromScrapping(result, outputfile)
}

module.exports = operations