const _ = require('lodash')
const fs = require('fs-extra')
const { filename } = require('./lib/utils')
const json2xls = require('./lib/json2xls')

function operations (options) {
  let result

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
    result = _.differenceWith(result, file, _.isEqual)
  }

  fs.writeJsonSync(filename(options.output, '.json'), result, { spaces: 1 })
  if (options.excel) json2xls(result, filename(options.output, '.xls'))
}

module.exports = operations
