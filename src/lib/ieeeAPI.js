const axios = require('axios');
const https = require('https');
const { locateChrome, locateFirefox } = require('locate-app');
const path = require('path');
const puppeteer = require('puppeteer-core');
const createJSON = require('./createJson');
const { escapeRegExp, getLineStack } = require('./utils');

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
  // only wait this amount of milliseconds, any longer and it means there's no results
  const timeout = 20000;
  let lineStack; // stack message with line info

  const ieeeSearchUrl = 'https://ieeexplore.ieee.org/search/searchresult.jsp';
  const ELEMENTS = 'xpl-results-item > div.hide-mobile';
  const RESULTS = 'h1.Dashboard-header.col-12 > span:nth-child(1)';
  const NO_RESULTS = 'div.List-results-message.List-results-none';
  const NEXT = '.stats-Pagination_arrow_next_2';

  if (verbose) console.log('Query: \t%s\n', queryText);
  const query = `?queryText=(${encodeURI(queryText).replace(/\?/g, '%3F').replace(/\//g, '%2F')})`
              + `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`;
  if (verbose) console.log('Encoded Query:\t%s\n', query);

  // Test for redirects
  const regex = new RegExp(`${escapeRegExp(ieeeSearchUrl)}(;jsessionid=[a-zA-Z0-9!-_]*)?${escapeRegExp(query)}.*`);

  let executablePath; // path to either Chrome (preferred) or Firefox
  let product; // Which browser to launch
  let headless; // Chrome uses a different type
  let totalPages = 1; // counter for total number of pages
  let TOTAL_PAGES; // calculated number of pages
  let browser;
  let results;

  try {
    // Prefer Chrome over Firefox
    executablePath = await locateChrome();
    product = 'chrome';
    headless = 'new';
  } catch (errorChrome) {
    try {
      executablePath = await locateFirefox();
      product = 'firefox';
      headless = true;
    } catch (errorFirefox) {
      console.error("Can't find a valid installation of Chrome or Firefox");
      process.exit(2);
    }
  }

  try {
    browser = await puppeteer.launch({
      product,
      executablePath,
      headless,
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(timeout);
    await page.goto(ieeeSearchUrl + query);
    if (!regex.test(page.url())) {
      throw new Error(`IEEE redirected, probably maintenance is happening.\n${page.url()}`);
    }

    // Wait for the records string, either has no results or "showing x of y"
    await page.waitForSelector(RESULTS);
    const records = await page.$eval(RESULTS, (el) => el.innerText);

    // Check if there are no results
    if (await page.$(NO_RESULTS) || records === 'No results found') {
      await browser.close();
      return { total_records: 0, articles: [] };
    }

    lineStack = getLineStack(18); await page.waitForSelector(ELEMENTS); // Wait until javascript loads all results
    await page.addScriptTag({
      path: path.join(__dirname, 'constants.js'),
    }); // Add all selectors as variables to window
    results = await page.evaluate(createJSON); // create JSON with results of first page

    // All the records
    const recordsNums = records.match(/(\d+)/g);
    if (!Array.isArray(recordsNums)) { // it has to be an Array, and it can be of length 2 or 3
      throw new Error("Couldn't find the total number of records");
    }
    const totalRecords = parseInt(recordsNums[2], 10);
    const recordsPerPage = parseInt(recordsNums[1], 10);
    TOTAL_PAGES = Math.ceil(totalRecords / recordsPerPage);

    // Check that NEXT selector is present if there are multiple pages
    if (TOTAL_PAGES > 1 && !await page.$(NEXT)) {
      throw new Error("There's multiple pages of results, but couldn't find the NEXT button");
    }

    /* eslint-disable no-await-in-loop */
    while (await page.$(NEXT) && totalPages <= TOTAL_PAGES) {
      await page.click(NEXT); // go to next page of results
      lineStack = getLineStack(18); await page.waitForSelector(ELEMENTS); // wait for results to load
      const pageResult = await page.evaluate(createJSON);
      results.push(...pageResult); // add page results to original object

      totalPages += 1;
    }
    /* eslint-enable no-await-in-loop */
    await browser.close(); // close browser
  } catch (error) {
    if (browser) await browser.close();
    if (error instanceof puppeteer.errors.TimeoutError && error.message.includes('Waiting for selector')) {
      error.stack = `${error.message}\n${lineStack}\n${error.stack.split('\n').slice(1).join('\n')}`;
    }
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Error scrapping results:\n${error.message}`);
      process.exit(2);
    }
    throw error;
  }
  if (verbose) { console.log('Total number of pages: %s (of %s calculated)\n', totalPages, TOTAL_PAGES); }
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
  } catch (cause) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`Error with IEEE API:\n${cause.message}`);
      process.exit(3);
    }
    if (!cause.response) throw cause;
    const error = new Error(cause.message, { cause });
    error.stack = `${cause.message}\n${cause.stack.split('\n').slice(1).join('\n')}`;
    throw error;
  }
  if (verbose) console.log('REQUEST PATH:\t%s\n', response.request.path);
  if (verbose >= 2) console.log('RESPONSE:\t%o', response);
  return response.data;
}

module.exports = {
  scrap,
  api,
};
