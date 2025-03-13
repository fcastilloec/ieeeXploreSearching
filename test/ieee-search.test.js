const { api, scrap } = require('../src/lib/ieee-api');
const untitled = require('./fixtures/scrap/untitled.json');

const expectedJson = {
  book: require('./fixtures/scrap/book.json'),
  bookChapter: require('./fixtures/scrap/bookChapter.json'),
  conferencePaper: require('./fixtures/scrap/conferencePaper.json'),
  course: require('./fixtures/scrap/course.json'),
  magazineArticle: require('./fixtures/scrap/magazineArticle.json'),
  journalArticle: require('./fixtures/scrap/journalArticle.json'),
  standard: require('./fixtures/scrap/standard.json'),
  multiple: require('./fixtures/scrap/multiple.json'),
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
    const results = await scrap(query, rangeYear, false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(expected);
  });
});

describe('Scrapping', () => {
  test('Title without link', async () => {
    const results = await scrap('optics AND nano AND QELS', [2000, 2000], false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(untitled[0]);
  });
});

describe('Scrapping', () => {
  test('Results in multiple pages', async () => {
    await expect(scrap('nack', [2000, 2003], false)).resolves.toMatchObject(expectedJson.multiple);
  });
});

describe.each(testArray)('Official API', ({ label, query, expected }) => {
  testIf()(label, async () => {
    const results = await api(process.env.APIKEY, query, rangeYear, false);
    const result = results.articles[0];
    delete result.abstract;
    expect(result).toMatchObject(expected);
  });
});
