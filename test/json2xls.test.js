const path = require('node:path');
const fs = require('fs-extra');
const { authorsString, fromResults } = require('../src/lib/json2xls');

test('authorsString with empty array', () => {
  expect(authorsString([])).toBe('');
});

test('authorsString with valid array', () => {
  expect(
    authorsString([
      { full_name: 'John Smith' },
      { full_name: 'Jane Doe' },
    ]),
  ).toBe('John Smith; Jane Doe');
});

test('fromResults', async () => {
  const file = path.join(__dirname, 'fixtures', 'result2.json');
  const output = `${file}.xls`;
  await fromResults(fs.readJsonSync(file), output);
  expect(() => fs.access(output)).not.toThrow();
  await fs.remove(output);
});
