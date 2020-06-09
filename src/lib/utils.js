const path = require('path')

function filename (filepath, ext) {
  if (!ext.startsWith('.')) ext = `.${ext}`
  const file = path.parse(filepath)
  return path.join(file.dir, file.name + ext)
}

module.exports = {
  filename
}
