const {
  changeFileExtension, testFileExtension, testYear, getLineStack,
} = require('../src/lib/utils');

const path = 'this/file.ext';
const out1 = 'this/file.new';
const out2 = 'this/file.ext.new';

test('changeFileExtension without period', () => {
  expect(changeFileExtension(path, 'new')).toBe(out1);
});

test('changeFileExtension with period', () => {
  expect(changeFileExtension(path, '.new')).toBe(out1);
});

test('testFileExtension without period', () => {
  expect(testFileExtension(path, 'new')).toBe(out2);
});

test('testFileExtension with same extension', () => {
  expect(testFileExtension(path, '.ext')).toBe(path);
});

test('testYear not throws for valid year', () => {
  expect(() => testYear(1990)).not.toThrow();
});

test('testYear throws if not an integer', () => {
  expect(() => testYear(15.4)).toThrow('Year has to be an integer');
});

test('testYear throws before 1900', () => {
  expect(() => testYear(0)).toThrow('Year option has to be after 1900');
});

test('testYear throws after current year', () => {
  expect(() => testYear(1e14)).toThrow('Year option has to be before current year');
});

test('getLineStack returns message with line', () => {
  expect(getLineStack()).toBe(`    at ${__filename}:42:10`); // the numbers need to change if this line moves
});
