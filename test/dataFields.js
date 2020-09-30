const test = require('ava');
const { addDataField } = require('../src/lib/dataFields');

test('addDataField without field', (t) => {
  const query = 'optics AND nano';
  t.is(addDataField(query), query);
});

test('addDataField with field', (t) => {
  const query = 'optics AND nano';
  t.is(addDataField(query, 'F'), 'F:optics AND F:nano');
});

// Because of the refactoring, this test is not necessary for coverage, but necessary for parentheses checks
test('addDataField with field and parentheses', (t) => {
  const query = 'optics AND ((nano OR network) NEAR (gigabyte))';
  t.is(addDataField(query, 'F'), 'F:optics AND ((F:nano OR F:network) NEAR (F:gigabyte))');
});

test('addDataField with a multi-word phase', (t) => {
  const query = 'optics NEAR/15 "nano network gigabyte"';
  t.is(addDataField(query, 'F'), 'F:optics NEAR/15 F:"nano network gigabyte"');
});
