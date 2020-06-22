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

test('addDataField with field and parenthesis', (t) => {
  const query = 'optics AND (nano OR network)';
  t.is(addDataField(query, 'F'), 'F:optics AND (F:nano OR F:network)');
});
