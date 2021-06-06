const { addDataField } = require('../src/lib/dataFields');

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
  const query = 'optics NEAR/15 "nano network gigabyte"';
  expect(addDataField(query, 'F')).toBe('F:optics NEAR/15 F:"nano network gigabyte"');
});
