const xl = require('excel4node');
const fs = require('fs-extra');
const { changeFileExtension } = require('./utils');

/**
 * Converts an array of authors into a string.
 *
 * @param   {object[]}  authors  The authors
 *
 * @return  {string}             Author's names
 */
function authorsString(authors) {
  if (authors.length === 0) return '';

  return authors.map((author) => author.full_name).join('; ');
}

/**
 * Creates an excel file based on an array of results.
 *
 * @param  {object[]]}  results      The results from scrapping IEEE, each result is an Object inside this array.
 * @param  {string}     xlsFilename  The path and filename where to save the Excel file.
 */
function fromResults(results, xlsFilename) {
  const COLUMNS = {
    publication_year: 1,
    article_number: 2,
    publication_date: 3,
    title: 4,
    authors: 5,
    publication_title: 6,
    abstract: 7,
    pdf_url: 9,
    doi: 8,
  };

  const sciHubUrl = 'https://sci-hub.tw/';

  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('Sheet 1');

  const wrapStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'left',
      vertical: 'top',
    },
  });
  const noWrapStyle = wb.createStyle({
    alignment: {
      wrapText: false,
      horizontal: 'left',
      vertical: 'top',
    },
  });
  const linkStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'left',
      vertical: 'center',
    },
  });

  ws.row(1).freeze();
  ws.row(1).filter();
  ws.column(COLUMNS.publication_year).setWidth(8);
  ws.column(COLUMNS.article_number).setWidth(11);
  ws.column(COLUMNS.publication_date).setWidth(20);
  ws.column(COLUMNS.title).setWidth(47);
  ws.column(COLUMNS.authors).setWidth(18);
  ws.column(COLUMNS.publication_title).setWidth(34);
  ws.column(COLUMNS.abstract).setWidth(50);
  ws.column(COLUMNS.pdf_url).setWidth(60);
  ws.column(COLUMNS.doi).setWidth(60);

  // Which colums should be hidden
  let pubDate = true;
  let doi = true;

  // ws.cell(row, col)
  ws.cell(1, COLUMNS.publication_year).string('YEAR').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.article_number).string('ARTICLE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.publication_date).string('DATE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.title).string('TITLE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.authors).string('AUTHORS').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.publication_title).string('JOURNAL').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.abstract).string('ABSTRACT').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.pdf_url).string('IEEE URL').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.doi).string('SCI-HUB URL').style({ font: { bold: true } });

  for (let i = 0; i < results.length; i++) {
    ws.row(i + 2).setHeight(97);
    ws.cell(i + 2, COLUMNS.publication_year).number(parseInt(results[i].publication_year, 10)).style(noWrapStyle);
    ws.cell(i + 2, COLUMNS.article_number).string(results[i].article_number).style(noWrapStyle);
    if (results[i].publication_date) {
      pubDate = false;
      ws.cell(i + 2, COLUMNS.publication_date).string(results[i].publication_date).style(noWrapStyle);
    }
    ws.cell(i + 2, COLUMNS.title).string(`${results[i].title}\n`).style(wrapStyle).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.authors).string(`${authorsString(results[i].authors.authors)}\n`).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.publication_title).string(`${results[i].publication_title || ''}\n`).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.abstract).string(`${results[i].abstract || ''}\n`).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.pdf_url).link(results[i].pdf_url || results[i].abstract_url || '').style(linkStyle);
    if (results[i].doi) {
      doi = false;
      ws.cell(i + 2, COLUMNS.doi).link(sciHubUrl + results[i].doi).style(linkStyle);
    }
  }

  if (pubDate) ws.column(COLUMNS.publication_date).hide();
  if (doi) ws.column(COLUMNS.doi).hide();

  wb.write(xlsFilename, (error) => {
    if (error) console.error(`Error writing xls file to disk\n${error.message}`);
    process.exit(4);
  });
}

/**
 * Creates an excel file from a JSON file.
 *
 * @param  {string}  file      The JSON file to convert.
 */
function fromFile(file) {
  const output = changeFileExtension(file, 'xls');
  try {
    const results = fs.readJsonSync(file);
    fromResults(results, output);
  } catch (error) {
    console.error(`Error reading JSON file:\n${error.message}`);
    process.exit(5);
  }
}

module.exports = {
  fromFile,
  fromResults,
};
