import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import readlineSync from 'readline-sync';
import { redError } from './helpers.mjs';

function checkAPIKey(configFile) {
  if (!existsSync(configFile)) {
    console.log("It's the first time you run this script.");
    try {
      // Ensure the directory exists (native version of ensureFileSync)
      const dir = dirname(configFile);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const key = readlineSync.question('Enter your IEEE API key: ');

      // Prepare the JSON data and write it synchronously
      writeFileSync(configFile, `{ APIKEY: ${key} }`, 'utf8');
      console.log('API key was saved');
    } catch (error) {
      redError(`Error saving the API key: ${error.message}`);
      process.exit(1);
    }
  }
}

export { checkAPIKey };
