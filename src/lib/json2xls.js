const xl = require('excel4node')
const fs = require('fs-extra')
const { filename } = require('./utils')

/**
 * Converts an array of authors (from API results) into a string.
 *
 * @param   {object[]}  authors  The authors return from an API search
 *
 * @return  {string}             Author's names
 */
function authorsString (authors) {
  if (authors.length === 0) return ''

  return authors.map(author => {
    return author.full_name
  }).join('; ')
}

/**
 * Creates an excel file on disk based on an array of results return from API search.
 *
 * @param  {object[]]}  results      The results from scrapping IEEE, each result is an Object inside this array.
 * @param  {string}     xlsFilename  The path and filename where to save the Excel file.
 */
function fromResults (results, xlsFilename) {
  const sciHubUrl = 'https://sci-hub.tw/'

  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('Sheet 1')

  const myStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'left',
      vertical: 'top'
    }
  })
  const linkStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'left',
      vertical: 'center'
    }
  })

  ws.row(1).freeze()
  ws.column(1).setWidth(7)
  ws.column(2).setWidth(15)
  ws.column(3).setWidth(47)
  ws.column(4).setWidth(18)
  ws.column(5).setWidth(34)
  ws.column(6).setWidth(50)
  ws.column(7).setWidth(42)
  ws.column(8).setWidth(42)

  // ws.cell(row, col)
  ws.cell(1, 1).string('YEAR').style({ font: { bold: true } })
  ws.cell(1, 2).string('DATE').style({ font: { bold: true } })
  ws.cell(1, 3).string('TITLE').style({ font: { bold: true } })
  ws.cell(1, 4).string('AUTHORS').style({ font: { bold: true } })
  ws.cell(1, 5).string('JOURNAL').style({ font: { bold: true } })
  ws.cell(1, 6).string('ABSTRACT').style({ font: { bold: true } })
  ws.cell(1, 7).string('IEEE URL').style({ font: { bold: true } })
  ws.cell(1, 8).string('SCI-HUB URL').style({ font: { bold: true } })

  for (let i = 0; i < results.length; i++) {
    ws.row(i + 2).setHeight(80)
    ws.cell(i + 2, 1).number(parseInt(results[i].publication_year)).style(myStyle)
    ws.cell(i + 2, 2).string(results[i].publication_date || '').style(myStyle)
    ws.cell(i + 2, 3).string(results[i].title + '\n').style(myStyle).style(myStyle)
    ws.cell(i + 2, 4).string(authorsString(results[i].authors.authors) + '\n').style(myStyle).style(myStyle)
    ws.cell(i + 2, 5).string((results[i].publication_title || '') + '\n').style(myStyle).style(myStyle)
    ws.cell(i + 2, 6).string((results[i].abstract || '') + '\n').style(myStyle)
    ws.cell(i + 2, 7).link(results[i].pdf_url || results[i].abstract_url || '').style(linkStyle)
    if (results[i].doi) ws.cell(i + 2, 8).link(sciHubUrl + results[i].doi).style(linkStyle)
  }
  wb.write(xlsFilename, (error, stats) => {
    if (error) console.error('Error writing xls file to disk\n' + error.message)
    process.exit(4)
  })
}

/**
 * Creates an excel file from a JSON file, either API or scrap based.
 *
 * @param  {object[]]}  results      The results from scrapping IEEE, each result is an Object inside this array.
 * @param  {string}     xlsFilename  The path and filename where to save the Excel file.
 */
function fromFile (file, api) {
  const output = filename(file, 'xls')
  try {
    const results = fs.readJsonSync(file)
    fromResults(results, output)
  } catch (error) {
    console.error('Error reading JSON file:\n' + error.message)
    process.exit(5)
  }
}

module.exports = {
  fromFile,
  fromResults
}
