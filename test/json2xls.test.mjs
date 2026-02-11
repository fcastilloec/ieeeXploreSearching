import { join, dirname } from 'node:path';
import { readFileSync, accessSync } from 'node:fs';
import { rm } from 'node:fs/promises';
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
  const data = JSON.parse(readFileSync(file, 'utf8'));
  await fromResults(data, output);

  expect(() => accessSync(output)).not.toThrow();
  await rm(output, { force: true });
});
