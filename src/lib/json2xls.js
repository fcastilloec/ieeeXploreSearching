const xl = require('excel4node');
const { promisify } = require('util');

const fontType = process.env.IEEE_font;

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
async function fromResults(results, xlsFilename) {
  const COLUMNS = {
    publication_year: 1,
    article_number: 2,
    publication_date: 3,
    title: 4,
    authors: 5,
    publication_title: 6,
    abstract: 7,
    sci_hub: 8,
    pdf_url: 9,
    content_type: 10,
    sciHubBaseUrl: 11,
  };

  const sciHubUrl = 'https://sci-hub.ee/';

  const wb = new xl.Workbook({
    defaultFont: {
      name: fontType || 'Liberation Serif',
      size: 12,
    },
  });
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
      wrapText: false,
      horizontal: 'left',
      vertical: 'center',
    },
    font: {
      name: fontType || 'Liberation Sans',
      size: 11,
      underline: true,
      color: '1A73E8',
    },
  });

  ws.row(1).freeze();
  ws.row(1).filter();
  ws.column(COLUMNS.publication_year).setWidth(8);
  ws.column(COLUMNS.article_number).setWidth(11);
  ws.column(COLUMNS.publication_date).setWidth(15);
  ws.column(COLUMNS.title).setWidth(45);
  ws.column(COLUMNS.authors).setWidth(18);
  ws.column(COLUMNS.publication_title).setWidth(20);
  ws.column(COLUMNS.abstract).setWidth(50);
  ws.column(COLUMNS.sci_hub).setWidth(44);
  ws.column(COLUMNS.pdf_url).setWidth(60);
  ws.column(COLUMNS.content_type).setWidth(15);

  // Which columns should be hidden
  let pubDateHide = true;
  let doiHide = true;

  // ws.cell(row, col)
  ws.cell(1, COLUMNS.publication_year).string('YEAR').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.article_number).string('ARTICLE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.publication_date).string('DATE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.title).string('TITLE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.authors).string('AUTHORS').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.publication_title).string('JOURNAL').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.abstract).string('ABSTRACT').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.sci_hub).string('SCI-HUB URL').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.pdf_url).string('IEEE URL').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.content_type).string('TYPE').style({ font: { bold: true } });
  ws.cell(1, COLUMNS.sciHubBaseUrl).string(sciHubUrl); // baseUrl that can be modified is Sci-Hub domain moves

  results.forEach((result, i) => {
    ws.row(i + 2).setHeight(97);
    ws.cell(i + 2, COLUMNS.publication_year).number(parseInt(result.publication_year, 10)).style(noWrapStyle);
    ws.cell(i + 2, COLUMNS.article_number).string(result.article_number).style(noWrapStyle);
    if (result.publication_date) {
      pubDateHide = false;
      ws.cell(i + 2, COLUMNS.publication_date).string(result.publication_date).style(noWrapStyle);
    }
    ws.cell(i + 2, COLUMNS.title).string(result.title).style(wrapStyle).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.authors).string(authorsString(result.authors.authors)).style(wrapStyle);
    ws.cell(i + 2, COLUMNS.publication_title).string(result.publication_title || '').style(wrapStyle);
    ws.cell(i + 2, COLUMNS.abstract).string(result.abstract || '').style(wrapStyle);
    ws.cell(i + 2, COLUMNS.pdf_url).link(result.pdf_url || result.abstract_url || '').style(linkStyle);
    if (result.doi) {
      doiHide = false;
      ws.cell(i + 2, COLUMNS.sci_hub).formula(`HYPERLINK(CONCATENATE($K$1,"${result.doi}"))`).style(linkStyle);
    }
    ws.cell(i + 2, COLUMNS.content_type).string(result.content_type).style(noWrapStyle);
  });

  /* istanbul ignore next */
  if (pubDateHide) ws.column(COLUMNS.publication_date).hide();
  /* istanbul ignore next */
  if (doiHide) ws.column(COLUMNS.sci_hub).hide();

  // Hides it to prevent cluttering the sheet
  ws.column(COLUMNS.sciHubBaseUrl).hide();

  // see https://github.com/nodejs/node/issues/30344#issuecomment-552120747
  const write = promisify(wb.write.bind(wb));
  return write(xlsFilename);
}

module.exports = {
  authorsString,
  fromResults,
};
