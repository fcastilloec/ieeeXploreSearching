const test = require('ava');
const fs = require('fs-extra');
const path = require('path');
const { authorsString, fromResults } = require('../src/lib/json2xls');

test('authorsString with empty array', (t) => {
  t.is(authorsString([]), '');
});

test('authorsString with valid array', (t) => {
  t.is(
    authorsString([
      { full_name: 'John Smith' },
      { full_name: 'Jane Doe' },
    ]),
    'John Smith; Jane Doe',
  );
});

test('fromResults', async (t) => {
  const file = path.join(__dirname, 'fixtures', 'result2.json');
  const output = `${file}.xls`;
  await fromResults(fs.readJsonSync(file), output);
  await t.notThrowsAsync(fs.access(output));
  await fs.remove(output);
});
