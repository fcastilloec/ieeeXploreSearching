const test = require('ava');
const { changeFileExtension, yearRange } = require('../src/lib/utils');

const path = 'this/file.ext';
const out = 'this/file.new';

test('changeFileExtension with period', (t) => {
  t.is(changeFileExtension(path, '.new'), out);
});

test('changeFileExtension without period', (t) => {
  t.is(changeFileExtension(path, 'new'), out);
});

test('yearRange is number', (t) => {
  const today = new Date().getFullYear();
  t.deepEqual(yearRange(1990), [1990, today]);
});

test('yearRange is array', (t) => {
  t.deepEqual(yearRange([1990, 1991]), [1990, 1991]);
});
