import { join, dirname } from 'node:path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { authorsString, fromResults } from '../src/lib/json2xls';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('authorsString with empty array', () => {
  expect(authorsString([])).toBe('');
});

test('authorsString with valid array', () => {
  expect(authorsString([{ full_name: 'John Smith' }, { full_name: 'Jane Doe' }])).toBe('John Smith; Jane Doe');
});

test('fromResults', async () => {
  const file = join(__dirname, 'fixtures', 'result2.json');
  const output = `${file}.xls`;
  await fromResults(fs.readJsonSync(file), output);
  expect(() => fs.access(output)).not.toThrow();
  await fs.remove(output);
});
