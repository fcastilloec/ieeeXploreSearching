import { api, scrap } from '../src/lib/ieee-api';
import untitled from './fixtures/scrap/untitled.json';
import book from './fixtures/scrap/book.json';
import bookChapter from './fixtures/scrap/bookChapter.json';
import conferencePaper from './fixtures/scrap/conferencePaper.json';
import course from './fixtures/scrap/course.json';
import magazineArticle from './fixtures/scrap/magazineArticle.json';
import journalArticle from './fixtures/scrap/journalArticle.json';
import standard from './fixtures/scrap/standard.json';
import multiple from './fixtures/scrap/multiple.json';

const expectedJson = {
  book,
  bookChapter,
  conferencePaper,
  course,
  magazineArticle,
  journalArticle,
  standard,
  multiple,
};

const labels = {
  book: 'Books',
  bookChapter: 'Book Chapter',
  conferencePaper: 'Conference Paper',
  course: 'Course',
  magazineArticle: 'Magazine Article',
  journalArticle: 'Journal Article',
  standard: 'Standards',
};

const queries = {
  book: '"3G CDMA2000 Wireless Engineering"',
  bookChapter: '"An Evolving and Developing Cellular Electronic Circuit"',
  conferencePaper: '"Robust two-camera tracking using homography"',
  course: '"Challenges Near the Limit of CMOS Scaling"',
  journalArticle: '"Characterization of adaptive modulators in fixed wireless ATM networks"',
  magazineArticle: '"Applying the Web ontology language to management information definitions"',
  standard: '"IEEE Guide to the Installation of Overhead Transmission Line Conductors"',
};

const rangeYear = [2004, 2004];

const testArray = [];
for (const query of Object.keys(queries)) {
  testArray.push({
    label: labels[query],
    query: queries[query],
    expected: expectedJson[query][0],
  });
}

function testIf() {
  return process.env.CI ? test.skip : test;
}

describe.each(testArray)('Scrapping', ({ label, query, expected }) => {
  test(label, async () => {
    const results = await scrap(query, rangeYear, true, false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(expected);
  });
});

describe('Scrapping', () => {
  test('Title without link', async () => {
    const results = await scrap('optics AND nano AND QELS', [2000, 2000], true, false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(untitled[0]);
  });
});

describe('Scrapping', () => {
  test('Results in multiple pages', async () => {
    await expect(scrap('nack', [2000, 2003], true, false)).resolves.toMatchObject(expectedJson.multiple);
  });
});

describe('Scrapping', () => {
  test("Don't search all content types", async () => {
    await expect(scrap(queries.standard, [2000, 2000], false, false)).resolves.toMatchObject({
      articles: [],
      total_records: 0,
    });
  });
});

describe.each(testArray)('Official API', ({ label, query, expected }) => {
  testIf()(label, async () => {
    const results = await api(process.env.APIKEY, query, rangeYear, true, false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(expected);
  });
});

describe('Official API', () => {
  testIf()("Don't search all content types", async () => {
    await expect(api(process.env.APIKEY, queries.standard, [2000, 2000], false, false)).resolves.toMatchObject({
      total_records: 0,
    });
  });
});
