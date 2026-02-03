import { build } from 'esbuild';

const outdir = 'build';
const inputFiles = ['src/cli-search.mjs', 'src/cli-logic.mjs', 'src/cli-count.mjs'];

// Step 1: Bundle with esbuild
console.log('Bundling with esbuild...');
const result = await build({
  entryPoints: inputFiles,
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'cjs', // pkg works better with CommonJS
  outdir,
  outExtension: { '.js': '.cjs' },
  minify: false,
  sourcemap: false,
  metafile: true,
});

console.log('✓ Bundle created at:', Object.keys(result.metafile.outputs));
