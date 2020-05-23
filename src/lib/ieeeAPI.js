/**
 * IEEE url to use for testing, it retrieves 52 results, in 3 pages
 * https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=optics%20AND%20nano&ranges=1990_2000_Year
 */
const puppeteer = require('puppeteer')
const createJSON = require('./createJson')

// const query = 'optics%20AND%20nano&ranges=1990_2000_Year'
const URL = 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText='
const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align'
const NEXT = 'div.ng-SearchResults.row > div.main-section > xpl-paginator > div.pagination-bar.hide-mobile > ul > li.next-btn > a'
const PAGES = 'div.ng-SearchResults.row > div.main-section > xpl-paginator > div.pagination-bar.hide-mobile > ul > li:not(.prev-btn):not(.next-btn):not(.next-page-set)'// .next-btn .next-page-set)'

/**
 * Loads a IEEE search page and scraps the results from all the pages.
 *
 * @param   {string}  query  The search terms. See querytext from https://developer.ieee.org/docs/read/Metadata_API_details
 *
 * @return  {object[]}       All the IEEE results from each page, from 'createJson' function.
 */
async function scrapResults (query) {
  let browser
  try {
    browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(URL + query)
    await page.waitForSelector(ELEMENTS) // Wait until javascript loads all results
    const results = await page.evaluate(createJSON) // create JSON with results of first page

    // TODO: check what happens when a single page of results or no results happen
    const totalPages = (await page.$$(PAGES)).length // check how many result pages exist
    for (let i = 0; i < totalPages - 1; i++) {
      await page.click(NEXT) // go to next page of results
      await page.waitForSelector(ELEMENTS) // wait for results to load
      const pageResult = await page.evaluate(createJSON)
      results.push(...pageResult) // add page results to original object
    }
    await browser.close() // close browser

    return results
  } catch (error) {
    await browser.close()
    console.error(error)
  }
}

module.exports = scrapResults
