const test = require('ava');
const { changeFileExtension, testYear } = require('../src/lib/utils');

const path = 'this/file.ext';
const out = 'this/file.new';

test('changeFileExtension with period', (t) => {
  t.is(changeFileExtension(path, '.new'), out);
});

test('changeFileExtension without period', (t) => {
  t.is(changeFileExtension(path, 'new'), out);
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
