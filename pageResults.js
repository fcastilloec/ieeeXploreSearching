/**
 * Watch for changes in the DOM before retrieving IEEE results and sends them to 'background.js'
 * The MutationObserver is the only way to see if the results have been loaded, since IEEE loads them via script.
 * Once all the "mutations" (a.k.a. changes to the DOM) have been seen, we send them via a port to the background
 */

// Generates CSV data based on all the results
function createJSON () {
  // LIST OF ELEMENTSS:
  const MAIN_SECTION = '#xplMainContent > div.ng-SearchResults.row > div.main-section'
  const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align'
  const TITLE = 'h2 > a'
  const AUTHORS = 'p.author'
  const JOURNAL = 'div.description > a'
  const YEAR = 'div.description > div.publisher-info-container > span[xplhighlight]'
  const ABSTRACT = 'div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > span'

  // Retrieves the list of results
  return Array.from(document.querySelectorAll(ELEMENTS)).reduce((obj, result, index) => {
    const authors = result.querySelector(AUTHORS)
    const titleElement = result.querySelector(TITLE) || result.querySelector('h2 > span')
    const document = titleElement.getAttribute('href')
    const abstract = result.querySelector(ABSTRACT)
    return {
      ...obj,
      [index]: {
        title: titleElement.innerText,
        year: result.querySelector(YEAR).innerText.slice(6),
        abstract: abstract ? abstract.innerText : '',
        authors: authors ? Array.prototype.map.call(authors.querySelectorAll('a > span'), author => author.innerText) : '',
        journal: result.querySelector(JOURNAL).innerText,
        document: document ? document.slice(10, -1) : '' // removes '/document/ and the trailing '/'
      }
    }
  }, {})
}

createJSON()
