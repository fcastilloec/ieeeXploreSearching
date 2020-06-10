/**
 * Watch for changes in the DOM before retrieving IEEE results and sends them to 'background.js'
 * The MutationObserver is the only way to see if the results have been loaded, since IEEE loads them via script.
 * Once all the "mutations" (a.k.a. changes to the DOM) have been seen, we send them via a port to the background
 */

/**
 * Queries the document/page for IEEE results.
 *
 * @returns {object[]}  Each IEEE result is an Object, which are part of the returned Array
 */
function createJSON () {
  // LIST OF ELEMENTSS:
  const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align'
  const TITLE = 'h2 > a'
  const AUTHORS = 'p.author'
  const JOURNAL = 'div.description > a'
  const YEAR = 'div.description > div.publisher-info-container > span[xplhighlight]'
  const ABSTRACT = 'div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > span'

  // Retrieves the list of results
  return Array.from(document.querySelectorAll(ELEMENTS)).map(result => {
    const authors = result.querySelector(AUTHORS)
    const titleElement = result.querySelector(TITLE) || result.querySelector('h2 > span')
    const abstract = result.querySelector(ABSTRACT)
    const journal = result.querySelector(JOURNAL)
    return {
      title: titleElement.innerText,
      year: result.querySelector(YEAR).innerText.slice(6),
      abstract: abstract ? abstract.innerText : '',
      authors: authors ? Array.prototype.map.call(authors.querySelectorAll('a > span'), author => author.innerText) : [],
      journal: journal ? journal.innerText : '',
      document: titleElement.getAttribute('href') || ''
    }
  })
}

// Call the function when executing this script file from background
createJSON()
