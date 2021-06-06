const { isEqual } = require('../src/lib/logicOperations');

test('isEqual with article_number', () => {
  const value1 = { article_number: 1 };
  expect(isEqual(value1, value1)).toBeTruthy();
});

test('isEqual without article_number', () => {
  const value2 = {
    title: 'title', publication_year: 2000, content_type: 'type', publisher: 'publisher',
  };
  expect(isEqual(value2, value2)).toBeTruthy();
});
