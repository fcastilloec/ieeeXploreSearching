const test = require('ava');
const { isEqual } = require('../src/lib/logicOperations');

test('isEqual with article_number', (t) => {
  const value1 = { article_number: 1 };
  t.true(isEqual(value1, value1));
});

test('isEqual without article_number', (t) => {
  const value2 = {
    title: 'title', publication_year: 2000, content_type: 'type', publisher: 'publisher',
  };
  t.true(isEqual(value2, value2));
});
