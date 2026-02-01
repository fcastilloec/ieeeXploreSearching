import fs from 'fs-extra';
import readlineSync from 'readline-sync';
import { redError } from './helpers.mjs';

function checkAPIKey(configFile) {
  if (!fs.existsSync(configFile)) {
    console.log("It's the first time you run this script.");
    try {
      fs.ensureFileSync(configFile);
      const key = readlineSync.question('Enter your IEEE API key: ');
      fs.writeJsonSync(configFile, { APIKEY: key }, { spaces: 2 });
      console.log('API key was saved');
    } catch (error) {
      redError(`Error saving the API key: ${error.message}`);
      process.exit(1);
    }
  }
}

export { checkAPIKey };
