/* eslint consistent-return: 0 */

const axios = require('axios').default;
const https = require('https');
const puppeteer = require('puppeteer');
const createJSON = require('./createJson');

/**
 * Search by scrapping the results from the IEEE search page.
 *
 * @param   {string}  query  The search terms.
 *                           See querytext from https://developer.ieee.org/docs/read/Metadata_API_details
 *
 * @return  {object[]}       All the IEEE results from each page, from 'createJson' function.
 */
async function scrap(querytext, rangeYear, verbose) {
  const ieeeUrl = 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=';
  const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align';
  const NORESULTS = 'div.List-results-message.List-results-none';
  const NEXT = 'div.ng-SearchResults.row > div.main-section > xpl-paginator > div.pagination-bar.hide-mobile > ul '
    + '> li.next-btn > a';

  if (verbose) console.log('Query: \t%s\n', querytext);
  const query = `(${encodeURI(querytext).replace(/\?/g, '%3F').replace(/\//g, '%2F')})`
              + `&ranges=${rangeYear[0]}_${rangeYear[1]}_Year`;
  if (verbose) console.log('Encoded Query:\t%s\n', query);

  let totalPages = 1; // counter for total number of pages

  let browser;
  let page;
  try {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    page.setDefaultTimeout(10000); // only wait 10 secs, any longer and it means there's no results
    await page.goto(ieeeUrl + query);

    // Check if there are no results
    if (await page.$(NORESULTS)) {
      await browser.close();
      return { total_records: 0, articles: [] };
    }

    await page.waitForSelector(ELEMENTS); // Wait until javascript loads all results
    const results = await page.evaluate(createJSON); // create JSON with results of first page

    // TODO: check what happens when a single page of results or no results happen
    /* eslint-disable no-await-in-loop */
    while (await page.$(NEXT)) {
      await page.click(NEXT); // go to next page of results
      await page.waitForSelector(ELEMENTS); // wait for results to load
      const pageResult = await page.evaluate(createJSON);
      results.push(...pageResult); // add page results to original object

      totalPages += 1;
    }
    /* eslint-enable */
    await browser.close(); // close browser

    if (verbose) console.log('Total number of pages: %s\n', totalPages);

    return { total_records: results.length, articles: results };
  } catch (error) {
    await browser.close();
    throw new Error(`Error scrapping results:\n${error.message}`);
  }
}

/**
 * Search using the IEEE API
 *
 * @param   {string}  apiKey     The API key
 * @param   {string}  querytext  The query string
 * @param   {number}  startYear  Start year of publication to restrict results by.
 * @param   {number}  endYear    End year of publication to restrict results by.
 *
 * @return  {object}             The results, it has three keys: total_records, total_searched, articles
 */
async function api(apiKey, querytext, rangeYear, verbose) {
  const APIURL = 'https://ieeexploreapi.ieee.org/api/v1/search/articles';

  if (verbose) console.log('Query: \t%s\n', querytext);
  if (verbose >= 2) console.log('ApiKey:\t%s', apiKey);

  const config = {
    method: 'get',
    baseURL: APIURL,
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
      querytext: `(${querytext})`,
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
    if (error.response) {
      console.error(`Error code: ${error.response.status}`);
      console.error(`Error data: ${error.response.data}`);
    }
    throw new Error(`Error with IEEE API:\n${error.message}`);
  }
  if (verbose) console.log('REQUEST PATH:\t%s\n', response.request.path);
  if (verbose >= 2) console.log('RESPONSE:\t%o', response);
  return response.data;
}

module.exports = {
  scrap,
  api,
};
