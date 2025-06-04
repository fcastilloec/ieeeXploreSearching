const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('cli-logic yargs parsing', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    mockExit.mockClear();
    mockConsoleError.mockClear();
    process.argv = ['node', 'cli-logic.js'];
    jest.resetModules();
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
    process.argv = originalArgv;
  });

  test('should parse merge command with output', () => {
    process.argv = ['node', 'cli-logic.js', '--merge', 'a.json', 'b.json', '--output', 'out.json'];
    const { argv } = require('../src/cli-logic');
    expect(argv.merge).toBe(true);
    expect(argv.output).toBe('out.json');
    expect(argv._).toEqual(['a.json', 'b.json']);
  });

  test('should parse and command with output', () => {
    process.argv = ['node', 'cli-logic.js', '--and', 'a.json', 'b.json', '--output', 'out.json'];
    const { argv } = require('../src/cli-logic');
    expect(argv.and).toBe(true);
    expect(argv.output).toBe('out.json');
    expect(argv._).toEqual(['a.json', 'b.json']);
  });

  test('should parse or command with output', () => {
    process.argv = ['node', 'cli-logic.js', '--or', 'a.json', 'b.json', '--output', 'out.json'];
    const { argv } = require('../src/cli-logic');
    expect(argv.or).toBe(true);
    expect(argv.output).toBe('out.json');
    expect(argv._).toEqual(['a.json', 'b.json']);
  });

  test('should parse not command with output', () => {
    process.argv = ['node', 'cli-logic.js', '--not', 'a.json', '--output', 'out.json'];
    const { argv } = require('../src/cli-logic');
    expect(argv.not).toBe('a.json');
    expect(argv.output).toBe('out.json');
  });

  test('should enforce at least one command', () => {
    process.argv = ['node', 'cli-logic.js', 'a.json', 'b.json', '--output', 'out.json'];
    require('../src/cli-logic');
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('At least one command is needed'));
  });

  test('should enforce at least two files for merge command', () => {
    process.argv = ['node', 'cli-logic.js', '--merge', 'a.json', '--output', 'out.json'];
    require('../src/cli-logic');
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Command needs at least two files to operate on'),
    );
  });

  test('should enforce at least two files for and command', () => {
    process.argv = ['node', 'cli-logic.js', '--and', 'a.json', '--output', 'out.json'];
    require('../src/cli-logic');
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Command needs at least two files to operate on'),
    );
  });

  test('should enforce at least two files for or command', () => {
    process.argv = ['node', 'cli-logic.js', '--or', 'a.json', '--output', 'out.json'];
    require('../src/cli-logic');
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Command needs at least two files to operate on'),
    );
  });

  test('should parse json2xls command', () => {
    process.argv = ['node', 'cli-logic.js', 'json2xls', 'a.json'];
    const { argv } = require('../src/cli-logic');
    expect(argv._).toEqual(['json2xls']);
    expect(argv.jsonFile).toBe('a.json');
  });
});
