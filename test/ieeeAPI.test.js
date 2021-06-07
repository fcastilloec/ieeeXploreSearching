const { scrap } = require('../src/lib/ieeeAPI');
const book = require('./fixtures/scrap/book.json');
const bookChapter = require('./fixtures/scrap/bookChapter.json');
const conferencePaper = require('./fixtures/scrap/conferencePaper.json');
const course = require('./fixtures/scrap/course.json');
const magazineArticle = require('./fixtures/scrap/magazineArticle.json');
const journalArticle = require('./fixtures/scrap/journalArticle.json');
const standard = require('./fixtures/scrap/standard.json');

const rangeYear = [2004, 2004];

const queries = {
  book: '"3G CDMA2000 Wireless Engineering"',
  bookChapter: '"An Evolving and Developing Cellular Electronic Circuit"',
  conferencePaper: '"Robust two-camera tracking using homography"',
  course: '"Challenges Near the Limit of CMOS Scaling"',
  magazineArticle: '"Applying the Web ontology language to management information definitions"',
  journalArticle: '"Characterization of adaptive modulators in fixed wireless ATM networks"',
  standard: '"IEEE Guide to the Installation of Overhead Transmission Line Conductors"',
};

test('Book', async () => {
  const result = (await scrap(queries.book, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(book[0]).toMatchObject(result);
});

test('Book Chapter', async () => {
  const result = (await scrap(queries.bookChapter, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(bookChapter[0]).toMatchObject(result);
});

test('Conference Paper', async () => {
  const result = (await scrap(queries.conferencePaper, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(conferencePaper[0]).toMatchObject(result);
});

test('Course', async () => {
  const result = (await scrap(queries.course, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(course[0]).toMatchObject(result);
});

test('Magazine Article', async () => {
  const result = (await scrap(queries.magazineArticle, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(magazineArticle[0]).toMatchObject(result);
});

test('Journal Article', async () => {
  const result = (await scrap(queries.journalArticle, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(journalArticle[0]).toMatchObject(result);
});

test('Standard', async () => {
  const result = (await scrap(queries.standard, rangeYear, false)).articles[0];
  delete result.abstract;
  expect(standard[0]).toMatchObject(result);
});
