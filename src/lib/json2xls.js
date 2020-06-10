const xl = require('excel4node')
const path = require('path')

function authorsString (authors) {
  if (authors.length === 0) return ''

  return authors.map(author => {
    return author.full_name
  }).join('; ')
}

/**
 * Creates an excel file on disk based on an array of results.
 *
 * @param  {object[]]}  results      The results from scrapping IEEE, each result is an Object inside this array.
 * @param  {string}     xlsFilename  The path and filename where to save the Excel file.
 */
function fromScrapping (results, xlsFilename) {
  const ieeeUrl = 'https://ieeexplore.ieee.org'

  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('Sheet 1')

  // ws.cell(row, col)
  ws.cell(1, 1).string('YEAR').style({ font: { bold: true } })
  ws.cell(1, 2).string('TITLE').style({ font: { bold: true } })
  ws.cell(1, 3).string('AUTHORS').style({ font: { bold: true } })
  ws.cell(1, 4).string('JOURNAL').style({ font: { bold: true } })
  ws.cell(1, 5).string('ABSTRACT').style({ font: { bold: true } })
  ws.cell(1, 6).string('IEEE URL').style({ font: { bold: true } })

  for (let i = 0; i < results.length; i++) {
    ws.cell(i + 2, 1).number(parseInt(results[i].year))
    ws.cell(i + 2, 2).string(results[i].title)
    ws.cell(i + 2, 3).string(results[i].authors.join('; '))
    ws.cell(i + 2, 4).string(results[i].journal)
    ws.cell(i + 2, 5).string(results[i].abstract)
    if (results[i].document !== '') ws.cell(i + 2, 6).link(ieeeUrl + results[i].document)
  }
  xlsFilename = path.parse(xlsFilename)
  wb.write(path.join(xlsFilename.dir, xlsFilename.name + '.xls'))
}

function fromAPI (results, xlsFilename) {
  const sciHubUrl = 'https://sci-hub.tw/'

  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('Sheet 1')

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
    ws.cell(i + 2, 1).number(parseInt(results[i].publication_year))
    ws.cell(i + 2, 2).string(results[i].publication_date)
    ws.cell(i + 2, 3).string(results[i].title)
    ws.cell(i + 2, 4).string(authorsString(results[i].authors.authors))
    ws.cell(i + 2, 5).string(results[i].publication_title)
    ws.cell(i + 2, 6).string(results[i].abstract ? results[i].abstract : '')
    ws.cell(i + 2, 7).link(results[i].pdf_url || results[i].abstract_url)
    if (results[i].doi) ws.cell(i + 2, 8).link(sciHubUrl + results[i].doi)
  }
  xlsFilename = path.parse(xlsFilename)
  wb.write(path.join(xlsFilename.dir, xlsFilename.name + '.xls'))
}

module.exports = {
  fromScrapping,
  fromAPI
}
