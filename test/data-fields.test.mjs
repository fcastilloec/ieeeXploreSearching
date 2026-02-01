import { addDataField, removeConflict, queryContainsField } from '../src/lib/data-fields';

test('addDataField without field', () => {
  const query = 'optics AND nano';
  expect(addDataField(query)).toBe(query);
});

test('addDataField with field', () => {
  const query = 'optics AND nano';
  expect(addDataField(query, 'F')).toBe('F:optics AND F:nano');
});

// Because of the refactoring, this test is not necessary for coverage, but necessary for parentheses checks
test('addDataField with field and parentheses', () => {
  const query = 'optics AND ((nano OR network) NEAR (gigabyte))';
  expect(addDataField(query, 'F')).toBe('F:optics AND ((F:nano OR F:network) NEAR (F:gigabyte))');
});

test('addDataField with a multi-word phase', () => {
  const query = 'encod* AND ("real time" OR (real ONEAR/2 time)) AND "rate" AND (different NEAR/5 quality)';
  expect(addDataField(query, 'F')).toBe(
    'F:encod* AND (F:"real time" OR (F:real ONEAR/2 F:time)) AND F:"rate" AND (F:different NEAR/5 F:quality)',
  );
});

test('queryContainsField has a field', () => {
  const queryText = 'this has a "IEEE Terms":field';
  expect(queryContainsField(queryText)).toBeTruthy();
});

test('queryContainsField does not have a field', () => {
  const queryText = 'this has "not a":field';
  expect(queryContainsField(queryText)).toBeFalsy();
});

test('removeConflict removes the string', () => {
  const output = ['documentTitle', 'fullTextAndMetadata', 'ieeeTerms', 'metadata', 'publicationTitle', 'textOnly'];
  expect(removeConflict('abstract')).toStrictEqual(output);
});
