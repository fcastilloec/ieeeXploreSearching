// Mocking process.exit to prevent the tests from exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
// Mocking console.error to prevent errors from polluting test output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
// Mocking console.warn
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('cli-search yargs parsing', () => {
  // Store the original process.argv and process.env
  const originalArgv = process.argv;
  const originalEnv = process.env;

  // Before each test, reset mocks and ensure a clean state
  beforeEach(() => {
    mockExit.mockClear();
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();

    // Reset process.argv to a base state
    process.argv = ['node', 'cli-search.js'];

    // Reset process.env to a copy of originalEnv, and then clear specific variables
    process.env = { ...originalEnv };
    delete process.env.OUT;
    delete process.env.YEARS;

    jest.resetModules(); // Clears module cache so cli-search.js is re-required
  });

  // Restore original implementations after all tests are done
  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    process.argv = originalArgv; // Restore original argv
    process.env = originalEnv; // Restore original env
  });

  test('should parse a basic query and default options', () => {
    process.argv = ['node', 'cli-search.js', 'test query', '-y', '2000']; // Added -y for basic case
    const { argv } = require('../src/cli-search');

    expect(argv._[0]).toBe('test query');
    expect(argv.output).toBeUndefined(); // Should be undefined if OUT env is not set and no -o
    expect(argv.excel).toBe(false);
    expect(argv.year).toEqual([2000, 2000]); // Should be a range even if one year given implicitly
    expect(argv.year.length).toBe(2);
    expect(argv.scrap).toBe(false);
    expect(argv.verbose).toBe(0);
    expect(argv.allContentTypes).toBe(false);
  });

  test('should parse output option with filename', () => {
    process.argv = ['node', 'cli-search.js', 'another query', '-o', 'results.json', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.output).toBe('results.json');
  });

  test('should parse output option from environment variable OUT (string)', () => {
    process.env.OUT = 'env_results.json';
    process.argv = ['node', 'cli-search.js', 'env query', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.output).toBe('env_results.json');
  });

  test('should parse output option from environment variable OUT (integer)', () => {
    process.env.OUT = '123';
    process.argv = ['node', 'cli-search.js', 'env query', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.output).toBe('search123');
  });

  test('should parse full-text-and-metadata option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-f', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.fullTextAndMetadata).toBe(true);
  });

  test('should parse text-only option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-t', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.textOnly).toBe(true);
  });

  test('should parse publication-title option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-p', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.publicationTitle).toBe(true);
  });

  test('should parse document-title option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-d', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.documentTitle).toBe(true);
  });

  test('should parse metadata option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-m', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.metadata).toBe(true);
  });

  test('should parse ieee-terms option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-i', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.ieeeTerms).toBe(true);
  });

  test('should handle conflicts between data field options', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-f', '-t', '-y', '2000'];
    require('../src/cli-search');
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalled();
  });

  test('should parse excel option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-e', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.excel).toBe(true);
  });

  test('should parse single year option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-y', '2020'];
    const { argv } = require('../src/cli-search');

    expect(argv.year).toEqual([2020, 2020]);
  });

  test('should parse year range option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-y', '2000', '-y', '2005'];
    const { argv } = require('../src/cli-search');

    expect(argv.year).toEqual([2000, 2005]);
  });

  test('should parse year range from environment variable YEARS', () => {
    process.env.YEARS = '1990:1995';
    process.argv = ['node', 'cli-search.js', 'env year query'];
    const { argv } = require('../src/cli-search');

    expect(argv.year).toEqual([1990, 1995]);
  });

  test('should parse single year from environment variable YEARS', () => {
    process.env.YEARS = '2000';
    process.argv = ['node', 'cli-search.js', 'env year query'];
    const { argv } = require('../src/cli-search');

    expect(argv.year).toEqual([2000, 2000]);
  });

  test('should exit if YEARS env variable is invalid', () => {
    process.env.YEARS = 'invalid-year';
    process.argv = ['node', 'cli-search.js', 'query'];
    require('../src/cli-search');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('YEARS env variable: Year has to be an integer (user: NaN)'),
    );
  });

  test('should parse scrap option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-s', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.scrap).toBe(true);
  });

  test('should parse verbose option (single -v)', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-v', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.verbose).toBe(1);
  });

  test('should parse verbose option (multiple -vvv)', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-vvv', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.verbose).toBe(3);
  });

  test('should parse all-content-types option', () => {
    process.argv = ['node', 'cli-search.js', 'query', '-a', '-y', '2000'];
    const { argv } = require('../src/cli-search');

    expect(argv.allContentTypes).toBe(true);
  });

  test('should enforce demandCommand(1, 1)', () => {
    process.argv = ['node', 'cli-search.js']; // No query, so -y is still needed or env YEARS
    require('../src/cli-search');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('No search query specified'));
  });

  test('should handle missing output when process.env.OUT is not set', () => {
    // We already ensure process.env.OUT is not set in beforeEach
    process.argv = ['node', 'cli-search.js', 'query', '-y', '2000']; // Need to provide year
    require('../src/cli-search');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Missing required argument: output'));
  });

  test('should not warn on Windows if platform is not win32', () => {
    // Temporarily set platform to something other than win32
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });
    process.argv = ['node', 'cli-search.js', 'query', '-y', '2000'];
    require('../src/cli-search');
    expect(mockConsoleWarn).not.toHaveBeenCalled();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform, // Restore original platform
    });
  });

  test('should warn on Windows if platform is win32', () => {
    // Temporarily set platform to win32
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });
    process.argv = ['node', 'cli-search.js', 'query', '-y', '2000'];
    require('../src/cli-search');
    expect(mockConsoleWarn).toHaveBeenCalledWith("You're running on a Windows system");
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      '\u001B[4m%s\u001B[0m\u001B[31;1m%s\u001B[0m\n\n',
      'Make sure you escape double quotes using:',
      String.raw` \"`,
    );
    Object.defineProperty(process, 'platform', {
      value: originalPlatform, // Restore original platform
    });
  });
});
