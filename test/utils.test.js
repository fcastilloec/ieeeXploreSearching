const {
  changeFileExtension, testFileExtension, testYears, getLineStack,
} = require('../src/lib/utils');

const path = 'this/file.ext';
const out1 = 'this/file.new';
const out2 = 'this/file.ext.new';

test('getLineStack returns message with line', () => {
  // the numbers need to change if the next line moves
  expect(getLineStack()).toBe(`    at ${__filename}:11:10`);
});

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

test('testYears throws for more than two years', () => {
  const years = [1990, 1991, 1992];
  expect(() => testYears(years)).toThrow(`Only provide up to two years to specify a range (user ${years})`);
});

test('testYears not throws for valid year', () => {
  expect(() => testYears([1990])).not.toThrow();
});

test('testYears throws if not an integer', () => {
  expect(() => testYears([15.4])).toThrow('Year has to be an integer');
});

test('testYears throws before 1900', () => {
  expect(() => testYears([0])).toThrow('Year has to be after 1900 (user: 0)');
});

test('testYears throws after current year', () => {
  expect(() => testYears([1e14])).toThrow('Year has to be the current year or earlier (user: 100000000000000)');
});
