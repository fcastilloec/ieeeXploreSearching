import https from 'node:https';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { locateChrome, locateFirefox } from 'locate-app';
import { launch } from 'puppeteer-core';
import createJSON from './create-json.mjs';
import { escapeRegExp, getLineStack, redError } from './helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Search by scrapping the results from the IEEE search page.
 *
 * @param   {string}   queryText  The search terms.
 *                                See queryText from https://developer.ieee.org/docs/read/Metadata_API_details
 * @param   {number[]} rangeYear  A two-element array containing the range of years to filter results
 * @param   {boolean}  allContentTypes Whether to search all content types, or just Magazines, Conferences, and Journals
 *
 * @return  {object[]}            All the IEEE results from each page, from 'createJson' function.
 */
async function scrap(queryText, rangeYear, allContentTypes, verbose) {
  // only wait this amount of milliseconds, any longer and it means there's no results
  const timeout = process.env.CI ? 40000 : 20000;
  let lineStack; // stack message with line info

  const userAgentChrome =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)' + 'Chrome/117.0.0.0 Safari/537.36';
  const userAgentFirefox = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0';
  const ieeeSearchUrl = 'https://ieeexplore.ieee.org/search/searchresult.jsp';
  const ELEMENTS = '.List-results-items'; // change in constants.mjs
  const RESULTS = 'h1.Dashboard-header.col-12 > span:nth-child(1)';
  const NO_RESULTS = 'div.List-results-message.List-results-none';
  const NEXT = '.next-btn';

  if (verbose) console.log('Query: %s\n', queryText);
  let query =
    `?queryText=(${encodeURI(queryText).replaceAll('?', '%3F').replaceAll('/', '%2F')})` +
    `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`;
  if (!allContentTypes) {
    query += '&refinements=ContentType:Conferences&refinements=ContentType:Journals&refinements=ContentType:Magazines';
  }
  if (verbose) console.log('Encoded Query: %s\n', query);

  // Test for redirects
  const regex = new RegExp(`${escapeRegExp(ieeeSearchUrl)}(;jsessionid=[a-zA-Z0-9!-_]*)?${escapeRegExp(query)}.*`);

  let userAgent;
  let executablePath; // path to either Chrome (preferred) or Firefox
  let headless; // Chrome uses a different type
  let totalPages = 1; // counter for total number of pages
  let TOTAL_PAGES; // calculated number of pages
  let browser;
  let results;

  try {
    // Prefer Chrome over Firefox
    executablePath = await locateChrome();
    browser = 'chrome';
    headless = true;
    userAgent = userAgentChrome;
  } catch {
    try {
      executablePath = await locateFirefox();
      browser = 'firefox';
      headless = true;
      userAgent = userAgentFirefox;
    } catch {
      redError("Can't find a valid installation of Chrome or Firefox");
      process.exit(2);
    }
  }

  try {
    browser = await launch({
      browser,
      executablePath,
      headless,
      slowMo: process.env.CI ? 15 : 5, // Extra 10ms on CI
      args: ['--width=1920', '--height=1080', ...(process.env.CI ? ['--no-sandbox'] : [])],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.setDefaultTimeout(timeout);
    await page.setUserAgent(userAgent);
    await page.goto(ieeeSearchUrl + query);
    if (!regex.test(page.url())) {
      throw new Error(`IEEE redirected, probably maintenance is happening.\n${page.url()}`);
    }

    // Wait for the records string, either has no results or "showing x of y"
    await page.waitForSelector(RESULTS);
    const records = await page.$eval(RESULTS, (element) => element.textContent);

    // Check if there are no results
    if ((await page.$(NO_RESULTS)) || records === 'No results found') {
      await browser.close();
      return { total_records: 0, articles: [] };
    }

    // prettier-ignore
    { lineStack = getLineStack(18); await page.waitForSelector(ELEMENTS); } // Wait until javascript loads all results

    await page.addScriptTag({
      path: join(__dirname, 'constants.mjs'),
    }); // Add all selectors as variables to window
    results = await page.evaluate(createJSON); // create JSON with results of first page

    // All the records
    const recordsNums = records.match(/(\d+)/g);
    if (!Array.isArray(recordsNums)) {
      // it has to be an Array, and it can be of length 2 or 3
      throw new TypeError("Couldn't find the total number of records");
    }
    if (recordsNums.length === 3) recordsNums.shift(); // remove unneeded number
    const totalRecords = Number.parseInt(recordsNums[1], 10);
    const recordsPerPage = Number.parseInt(recordsNums[0], 10);
    TOTAL_PAGES = Math.ceil(totalRecords / recordsPerPage);

    // Check that NEXT selector is present if there are multiple pages
    if (TOTAL_PAGES > 1 && !(await page.$(NEXT))) {
      throw new Error("There's multiple pages of results, but couldn't find the NEXT button");
    }

    while ((await page.$(NEXT)) && totalPages <= TOTAL_PAGES) {
      const firstResultOld = await page.$eval(ELEMENTS, (el) => el.innerText).catch(() => '');

      const nextBtn = await page.$(NEXT);
      await nextBtn.scrollIntoViewIfNeeded(); // in case the button is hidden because is out of view
      await page.click(NEXT); // go to next page of results

      // Wait for spinner lifecycle (Appear -> Disappear)
      await page.waitForSelector('xpl-progress-spinner', { visible: true }).catch(() => {});
      await page.waitForSelector('xpl-progress-spinner', { hidden: true }); // this also catches removals from DOM

      // Wait until the results container actually shows DIFFERENT text
      await page.waitForFunction(
        (selector, oldText) => {
          const el = document.querySelector(selector);
          return (
            el && // The element exists
            el.innerText.trim().length > 0 && // It has text
            !el.innerText.includes('Getting results') && // The text is not "Getting results"
            el.innerText !== oldText // Text is not the same as the previous page
          );
        },
        { timeout: 8000, polling: 'mutation' }, // Mutation polling is more sensitive to DOM changes
        ELEMENTS,
        firstResultOld,
      );

      const pageResult = await page.evaluate(createJSON);
      results.push(...pageResult); // add page results to original object

      totalPages += 1;

      await new Promise((r) => setTimeout(r, 200)); // A tiny breather to prevent "Sustained High Speed" flagging
    }

    await browser.close(); // close browser
  } catch (error) {
    if (browser) await browser.close();
    if (
      (error.name === 'TimeoutError' && error.message.includes('Waiting for selector')) ||
      (error.name === 'TypeError' && error.message.includes('Cannot read properties of null'))
    ) {
      error.stack = `${error.message}\n${lineStack}\n${error.stack.split('\n').slice(1).join('\n')}`;
    }

    if (process.env.NODE_ENV !== 'test') {
      redError(`Error scrapping results:\n${error.message}`);
      process.exit(2);
    }
    throw error;
  }
  if (verbose) {
    console.log('Total number of pages: %s (of %s calculated)\n', totalPages, TOTAL_PAGES);
  }
  return { total_records: results.length, articles: results };
}

/**
 * Search using the IEEE API
 *
 * @param {string}   apiKey       The API key
 * @param {string}   queryText    The query string
 * @param {number[]} rangeYear    A two-element array containing the range of years to filter results
 * @param {boolean}  allContentTypes  Whether to search all content types, or just Magazines, Conferences, and Journals
 *
 * @return  {object}              The results, it has three keys: total_records, total_searched, articles
 */
async function api(apiKey, queryText, rangeYear, allContentTypes, verbose) {
  const API_URL = 'https://ieeexploreapi.ieee.org/api/v1/search/articles';

  if (verbose) console.log('Query: %s\n', queryText);
  if (verbose >= 2) console.log('ApiKey: %s', apiKey);

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
      ...(allContentTypes ? {} : { content_type: 'Journals,Magazines,Conferences' }),
    },
  };

  let response;
  try {
    response = await axios(config);
  } catch (error_) {
    if (process.env.NODE_ENV !== 'test') {
      redError(`Error with IEEE API:\n${error_.message}`);
      process.exit(3);
    }
    if (!error_.response) throw error_;
    const error = new Error(error_.message, { cause: error_ });
    error.stack = `${error_.message}\n${error_.stack.split('\n').slice(1).join('\n')}`;
    throw error;
  }
  if (verbose) console.log('REQUEST PATH:\t%s\n', response.request.path);
  if (verbose >= 2) console.log('RESPONSE:\t%o', response);
  return response.data;
}

function scrapLink(queryText, rangeYear, allContentTypes) {
  const ieeeSearchUrl = 'https://ieeexplore.ieee.org/search/searchresult.jsp';
  let query =
    `?queryText=(${encodeURI(queryText).replaceAll('?', '%3F').replaceAll('/', '%2F')})` +
    `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`;
  if (!allContentTypes) {
    query += '&refinements=ContentType:Conferences&refinements=ContentType:Journals&refinements=ContentType:Magazines';
  }
  return ieeeSearchUrl + query;
}

export { scrap, api, scrapLink };
