/**
 * Watch for changes in the DOM before retrieving IEEE results and sends them to 'background.js'
 * The MutationObserver is the only way to see if the results have been loaded, since IEEE loads them via script.
 * Once all the "mutations" (a.k.a. changes to the DOM) have been seen, we send them via a port to the background
 */

const SCI_HUB_URL = 'https://sci-hub.tw/https://ieeexplore.ieee.org'

// LIST OF ELEMENTSS:
const MAIN_SECTION = '#xplMainContent > div.ng-SearchResults.row > div.main-section'
const ELEMENTS = 'div.row.result-item.hide-mobile > div.col.result-item-align'
const TITLE = 'h2 > a'
const AUTHORS = 'p.author'
const JOURNAL = 'div.description > a'
const YEAR = 'div.description > div.publisher-info-container > span[xplhighlight]'
const ABSTRACT = 'div.js-displayer-content.u-mt-1.stats-SearchResults_DocResult_ViewMore > span'

// Generates CSV data based on all the results
function createCSV () {
  // Retrieves the list of results
  const results = document.querySelectorAll(ELEMENTS)

  // Sets the header of the CSV file
  let csv = 'YEAR,TITLE,ABSTRACT,AUTHORS,JOURNAL,"SCI-HUB URL"\n'

  // Creates the rows for CSV files with each result
  results.forEach(el => {
    const year = el.querySelector(YEAR).innerText.slice(6) // Only the actual year, no need for the string "YEAR: "

    const titleElement = el.querySelector(TITLE)
    const title = titleElement.innerText
    const sciHub = SCI_HUB_URL + titleElement.getAttribute('href')

    const journal = el.querySelector(JOURNAL).innerText

    // Check that there's an abstract. Not all have one
    let abstract = el.querySelector(ABSTRACT)
    abstract = abstract ? abstract.innerText : ''

    // Check that it has authors. Not all have one
    let authors = el.querySelector(AUTHORS)
    authors = authors ? el.querySelector(AUTHORS).innerText : ''

    // appends each results to the csv as a new row
    csv += `${year},"${title}","${abstract}","${authors}","${journal}","${sciHub}"\n`
  })

  return csv
}
