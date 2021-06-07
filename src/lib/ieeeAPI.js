const axios = require('axios').default;
const https = require('https');
const locateChrome = require('locate-chrome');
const puppeteer = require('puppeteer-core');
const createJSON = require('./createJson');

/**
 * Search by scrapping the results from the IEEE search page.
 *
 * @param   {string}   queryText  The search terms.
 *                                See queryText from https://developer.ieee.org/docs/read/Metadata_API_details
 * @param   {number[]} rangeYear  A two-element array containing the range of years to filter results
 *
 * @return  {object[]}            All the IEEE results from each page, from 'createJson' function.
 */
async function scrap(queryText, rangeYear, verbose) {
  const ieeeSearchUrl = 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=';
  const ELEMENTS = 'xpl-results-item > div.hide-mobile';
  const NO_RESULTS = 'div.List-results-message.List-results-none';
  const NEXT = 'div.ng-SearchResults.row > div.main-section > xpl-paginator > div.pagination-bar.hide-mobile > ul '
    + '> li.next-btn > a';

  if (verbose) console.log('Query: \t%s\n', queryText);
  const query = `(${encodeURI(queryText).replace(/\?/g, '%3F').replace(/\//g, '%2F')})`
              + `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`;
  if (verbose) console.log('Encoded Query:\t%s\n', query);

  const browserPath = await locateChrome();
  if (!browserPath) {
    console.error('Can\'t find a valid installation of Chrome');
    process.exit(2);
  }

  let totalPages = 1; // counter for total number of pages
  let browser;
  let results;
  try {
    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true,
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(10000); // only wait 10 secs, any longer and it means there's no results
    await page.goto(ieeeSearchUrl + query);

    // Check if there are no results
    if (await page.$(NO_RESULTS)) {
      await browser.close();
      return { total_records: 0, articles: [] };
    }

    await page.waitForSelector(ELEMENTS); // Wait until javascript loads all results
    await page.addScriptTag({ path: './src/lib/constants.js' }); // Add all selectors as variables to window
    results = await page.evaluate(createJSON); // create JSON with results of first page

    // TODO: check what happens when a single page of results or no results happen
    /* eslint-disable no-await-in-loop */
    while (await page.$(NEXT)) {
      await page.click(NEXT); // go to next page of results
      await page.waitForSelector(ELEMENTS); // wait for results to load
      const pageResult = await page.evaluate(createJSON);
      results.push(...pageResult); // add page results to original object

      totalPages += 1;
    }
    /* eslint-enable no-await-in-loop */
    await browser.close(); // close browser
  } catch (error) {
    if (browser) await browser.close();
    console.error(`Error scrapping results:\n${error.message}`);
    process.exit(2);
  }
  if (verbose) { console.log('Total number of pages: %s\n', totalPages); }
  return { total_records: results.length, articles: results };
}

/**
 * Search using the IEEE API
 *
 * @param   {string}   apiKey     The API key
 * @param   {string}   queryText  The query string
 * @param   {number[]} rangeYear  A two-element array containing the range of years to filter results
 *
 * @return  {object}              The results, it has three keys: total_records, total_searched, articles
 */
async function api(apiKey, queryText, rangeYear, verbose) {
  const API_URL = 'https://ieeexploreapi.ieee.org/api/v1/search/articles';

  if (verbose) console.log('Query: \t%s\n', queryText);
  if (verbose >= 2) console.log('ApiKey:\t%s', apiKey);

  const config = {
    method: 'get',
    baseURL: API_URL,
    responseType: 'json',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    paramsSerializer: (params) => {
      let result = '';
      Object.keys(params).forEach((key) => {
        result += `${key}=${encodeURIComponent(params[key])}&`;
      });
      return result.substr(0, result.length - 1);
    },
    params: {
      querytext: `(${queryText})`,
      max_records: 200,
      apikey: apiKey,
      start_year: rangeYear[0],
      end_year: rangeYear[1],
    },
  };

  let response;
  try {
    response = await axios(config);
  } catch (error) {
    console.error('Error with IEEE API:');
    error.response
      ? console.error(`Error code: ${error.response.status}\nError data: ${error.response.data}`)
      : console.error(error.message);
    process.exit(3);
  }
  if (verbose) console.log('REQUEST PATH:\t%s\n', response.request.path);
  if (verbose >= 2) console.log('RESPONSE:\t%o', response);
  return response.data;
}

module.exports = {
  scrap,
  api,
};
