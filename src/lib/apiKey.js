const fs = require('fs-extra');
const readlineSync = require('readline-sync');

function checkAPIKey(configFile) {
  if (!fs.existsSync(configFile)) {
    console.log("It's the first time you run this script.");
    try {
      fs.ensureFileSync(configFile);
      const key = readlineSync.question('Enter your IEEE API key: ');
      fs.writeJsonSync(configFile, { APIKEY: key }, { spaces: 2 });
      console.log('API key was saved');
    } catch (error) {
      console.error('Error saving the API key: ', error.message);
      process.exit(1);
    }
  }
}

module.exports = checkAPIKey;
