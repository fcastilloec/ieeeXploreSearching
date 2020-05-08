/**
 * Saves CSV data to file, which was retrieved from the DOM via messages from 'pageReults.js'
 * It listen for messages from 'pageResults.js' every time a list of results gets updated.
 * The messages contain the CSV data, which is download into a file when the user presses the extension button.
 */

// Initializing CSV content received from pageResults.js
let csv

// Rule for enabling the extension icon only on IEEE Xplore
const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        // urlPrefix: 'ieeexplore.ieee.org/search/searchresult.jsp',
        hostEquals: 'ieeexplore.ieee.org',
        pathContains: 'search/searchresult.jsp',
        schemes: [ 'https' ]
      }
    })
  ],
  actions: [ new chrome.declarativeContent.ShowPageAction() ]
}

// Set the extension rule (copy/paste from Chrome docs)
chrome.runtime.onInstalled.addListener(function (details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([ rule ])
  })
})

// Listen for any messages received by the content-script "pageResults.js"
chrome.runtime.onConnect.addListener(port => {
  if (port.name == "csvResults") { // make sures it's the right port
    port.onMessage.addListener(msg => {
      csv = msg // overwrites content of csv
    })
  }
})
