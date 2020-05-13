const xl = require('excel4node')
const path = require('path')

const IEEEURL = 'https://ieeexplore.ieee.org/document/'

function excel (result, output) {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('Sheet 1')

  // ws.cell(row, col)
  ws.cell(1, 1).string('YEAR').style({ font: { bold: true } })
  ws.cell(1, 2).string('TITLE').style({ font: { bold: true } })
  ws.cell(1, 3).string('AUTHORS').style({ font: { bold: true } })
  ws.cell(1, 4).string('JOURNAL').style({ font: { bold: true } })
  ws.cell(1, 5).string('ABSTRACT').style({ font: { bold: true } })
  ws.cell(1, 6).string('IEEE URL').style({ font: { bold: true } })

  for (let i = 0; i < result.length; i++) {
    ws.cell(i + 2, 1).number(parseInt(result[i].year))
    ws.cell(i + 2, 2).string(result[i].title)
    ws.cell(i + 2, 3).string(result[i].authors.join('; '))
    ws.cell(i + 2, 4).string(result[i].journal)
    ws.cell(i + 2, 5).string(result[i].abstract)
    if (result[i].document !== '') ws.cell(i + 2, 6).link(IEEEURL + result[i].document)
  }
  output = path.parse(output)
  wb.write(path.join(output.dir, output.name + '.xls'))
}

module.exports = excel
