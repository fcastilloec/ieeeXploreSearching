import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLI = resolve(__dirname, '../src/cli-search.mjs');

function runCLI(args = [], env = {}) {
  return new Promise((resolvePromise) => {
    execFile(
      process.execPath,
      [CLI, '-v', ...args],
      {
        env: { ...process.env, YEARS: undefined, OUT: undefined, CI: true, ...env },
      },
      (error, stdout, stderr) => resolvePromise({ code: error?.code ?? 0, stdout, stderr }),
    );
  });
}

test('YEARS env var is honored when --year is missing', async () => {
  const res = await runCLI(['quantum'], { YEARS: '1999:2000', OUT: 'dummy' });
  expect(res.code).toBe(0);
  expect(res.stdout).toMatch(/Between 1999 and 2000/);
  expect(res.stderr).toBe('');
});

test('OUT env var is honored when --output is missing', async () => {
  // OUT=5 → becomes "search5" per your script
  const res = await runCLI(['optics', '--year', '2001'], { OUT: '5' });
  expect(res.code).toBe(0);
  expect(res.stdout).toMatch(/OUT: search5/);
  expect(res.stderr).not.toMatch(/Missing required option: --output/i);
});

test('Missing --year and YEARS → error & non‑zero exit', async () => {
  const res = await runCLI(['something'], { OUT: 'dummy' });
  expect(res.code).not.toBe(0);
  expect(res.stderr).toMatch(/Missing required argument:\s+--year/i);
});
