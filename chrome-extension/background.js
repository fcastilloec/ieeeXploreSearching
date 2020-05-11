/**
 * Saves CSV data to file, which was retrieved from the DOM via messages from 'pageReults.js'
 * It listen for messages from 'pageResults.js' every time a list of results gets updated.
 * The messages contain the CSV data, which is download into a file when the user presses the extension button.
 */

// Ask user where to save the CSV file
function saveToFile (data) {
  const link = document.createElement('a')
  link.setAttribute(
    'href',
    'data:text/plaincharset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)) // sets the data to download
  )
  link.setAttribute('download', 'results.json') // default filename 'results.csv'
  link.click() // shows the download dialog
}

// Rule for enabling the extension icon only on IEEE Xplore
const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        // urlPrefix: 'ieeexplore.ieee.org/search/searchresult.jsp',
        hostEquals: 'ieeexplore.ieee.org',
        pathContains: 'search/searchresult.jsp',
        schemes: ['https']
      }
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
}

// Set the extension rule (copy/paste from Chrome docs)
chrome.runtime.onInstalled.addListener(function (details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([rule])
  })
})

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript({ file: 'pageResults.js' }, response => saveToFile(response[0]))
})
