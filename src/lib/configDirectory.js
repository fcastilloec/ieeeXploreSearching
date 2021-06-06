const fs = require('fs-extra');
const { join } = require('path');
const pkg = require('../../package.json');

/**
 * Finds the configuration directory for this app.
 *
 * @returns {String} The path to the configuration directory, or undefined for unknown platforms.
 */
function configDir() {
  if (process.env.CONFIG_DIR) {
    if (!fs.pathExistsSync(process.env.CONFIG_DIR)) {
      console.error('Configuration directory does not exist');
      throw new Error('Configuration directory does not exist');
    }
    return process.env.CONFIG_DIR;
  }

  let dir;
  switch (process.platform) {
    case 'linux':
    case 'darwin':
      dir = process.env.XDG_CONFIG_HOME
        ? join(process.env.XDG_CONFIG_HOME, pkg.name)
        : join(process.env.HOME, '.config', pkg.name);
      break;
    case 'win32':
      dir = join(process.env.APPDATA, pkg.name);
      break;
    default:
      break;
  }
  return dir;
}

module.exports = configDir;
