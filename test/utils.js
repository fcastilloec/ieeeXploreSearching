const test = require('ava');
const { changeFileExtension, testFileExtension, testYear } = require('../src/lib/utils');

const path = 'this/file.ext';
const out1 = 'this/file.new';
const out2 = 'this/file.ext.new';

test('changeFileExtension without period', (t) => {
  t.is(changeFileExtension(path, 'new'), out1);
});

test('changeFileExtension with period', (t) => {
  t.is(changeFileExtension(path, '.new'), out1);
});

test('testFileExtension without period', (t) => {
  t.is(testFileExtension(path, 'new'), out2);
});

test('testFileExtension with same extension', (t) => {
  t.is(testFileExtension(path, '.ext'), path);
});

test('testYear not throws for valid year', (t) => {
  t.notThrows(() => testYear(1990));
});

test('testYear throws if not an integer', (t) => {
  t.throws(() => testYear(15.4), {
    instanceOf: TypeError,
    message: 'Year has to be an integer',
  });
});

test('testYear throws before 1900', (t) => {
  t.throws(() => testYear(0), {
    instanceOf: RangeError,
    message: 'Year option has to be after 1900',
  });
});

test('testYear throws after current year', (t) => {
  t.throws(() => testYear(1e14), {
    instanceOf: RangeError,
    message: 'Year option has to be before current year',
  });
});
