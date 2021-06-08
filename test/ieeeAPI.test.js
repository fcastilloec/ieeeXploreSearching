/* eslint-disable no-restricted-syntax, guard-for-in, global-require */
const { scrap } = require('../src/lib/ieeeAPI');
const untitled = require('./fixtures/scrap/untitled.json');

const expectedJson = {
  book: require('./fixtures/scrap/book.json'),
  bookChapter: require('./fixtures/scrap/bookChapter.json'),
  conferencePaper: require('./fixtures/scrap/conferencePaper.json'),
  course: require('./fixtures/scrap/course.json'),
  magazineArticle: require('./fixtures/scrap/magazineArticle.json'),
  journalArticle: require('./fixtures/scrap/journalArticle.json'),
  standard: require('./fixtures/scrap/standard.json'),
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
  magazineArticle: '"Applying the Web ontology language to management information definitions"',
  journalArticle: '"Characterization of adaptive modulators in fixed wireless ATM networks"',
  standard: '"IEEE Guide to the Installation of Overhead Transmission Line Conductors"',
};

const rangeYear = [2004, 2004];

const testArray = [];
for (const query in queries) {
  testArray.push(
    {
      label: labels[query],
      query: queries[query],
      expected: expectedJson[query][0],
    },
  );
}

function testIf() {
  return process.env.CI ? test.skip : test;
}

describe.each(testArray)(
  'Scrapping',
  ({ label, query, expected }) => {
    testIf()(label, async () => {
      const result = (await scrap(query, rangeYear, false)).articles[0];
      delete result.abstract;
      expect(result).toMatchObject(expected);
    });
  },
  20000,
);

describe('Scrapping', () => {
  testIf()('Title without link', async () => {
    const result = (await scrap('optics AND nano AND QELS', [2000, 2000], false)).articles[1];
    delete result.abstract;
    expect(result).toMatchObject(untitled[1]);
  },
  20000);
});
