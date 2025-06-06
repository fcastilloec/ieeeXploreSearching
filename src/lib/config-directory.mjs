import path from 'node:path';
import { pathExistsSync } from 'fs-extra/esm';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const package_ = require('../../package.json');

/**
 * Finds the configuration directory for this app.
 *
 * @returns {String} The path to the configuration directory, or undefined for unknown platforms.
 */
function configDirectory() {
  if (process.env.CONFIG_DIR) {
    if (!pathExistsSync(process.env.CONFIG_DIR)) {
      console.error('Configuration directory does not exist');
      throw new Error('Configuration directory does not exist');
    }
    return process.env.CONFIG_DIR;
  }

  let directory_;
  switch (process.platform) {
    case 'linux':
    case 'darwin': {
      directory_ =
        process.env.XDG_CONFIG_HOME ?
          path.join(process.env.XDG_CONFIG_HOME, package_.name)
        : path.join(process.env.HOME, '.config', package_.name);
      break;
    }
    case 'win32': {
      directory_ = path.join(process.env.APPDATA, package_.name);
      break;
    }
    default: {
      break;
    }
  }
  return directory_;
}

export { configDirectory };
