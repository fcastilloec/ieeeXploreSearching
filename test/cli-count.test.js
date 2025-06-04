const fs = require('fs-extra');

// Mock fs-extra's readJsonSync at the top level
jest.mock('fs-extra', () => ({
  readJsonSync: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
// Mock console.log and console.error
const mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('cli-count.js', () => {
  const originalArgv = process.argv;
  const cliCountPath = '../src/cli-count.js'; // Corrected path

  beforeEach(() => {
    // Clear mocks before each test
    fs.readJsonSync.mockClear();
    mockExit.mockClear();
    mockLog.mockClear();
    mockError.mockClear();

    // Reset argv for each test
    process.argv = [...originalArgv];
  });

  afterAll(() => {
    // Restore original argv and console/process functions after all tests
    process.argv = originalArgv;
    mockExit.mockRestore();
    mockLog.mockRestore();
    mockError.mockRestore();
  });

  test('should correctly count records in a valid JSON array file', () => {
    const mockFilename = 'test.json';
    const mockContent = [1, 2, 3, 4, 5];
    fs.readJsonSync.mockReturnValue(mockContent);

    process.argv = [...originalArgv, mockFilename];

    // Use isolateModules to ensure a fresh yargs context
    jest.isolateModules(() => {
      require(cliCountPath);
    });

    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename);
    expect(mockLog).toHaveBeenCalledWith('Records inside %s: %s', mockFilename, mockContent.length);
    expect(mockExit).not.toHaveBeenCalled();
  });

  test('should handle multiple valid JSON array files', () => {
    const mockFilename1 = 'test1.json';
    const mockFilename2 = 'test2.json';
    const mockContent1 = [{ id: 1 }, { id: 2 }];
    const mockContent2 = ['a', 'b', 'c'];

    fs.readJsonSync.mockReturnValueOnce(mockContent1).mockReturnValueOnce(mockContent2);

    process.argv = [...originalArgv, mockFilename1, mockFilename2];

    jest.isolateModules(() => {
      require(cliCountPath);
    });

    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename1);
    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename2);
    expect(mockLog).toHaveBeenCalledWith('Records inside %s: %s', mockFilename1, mockContent1.length);
    expect(mockLog).toHaveBeenCalledWith('Records inside %s: %s', mockFilename2, mockContent2.length);
    expect(mockExit).not.toHaveBeenCalled();
  });

  test('should exit with code 1 if no JSON file is specified (yargs handling)', () => {
    process.argv = [...originalArgv]; // No filename argument

    jest.isolateModules(() => {
      require(cliCountPath);
    });

    // We only expect process.exit to be called with code 1 by yargs
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('should exit with code 4 and log an error if JSON file does not contain an array', () => {
    const mockFilename = 'invalid.json';
    const mockContent = { key: 'value' }; // Not an array
    fs.readJsonSync.mockReturnValue(mockContent);

    process.argv = [...originalArgv, mockFilename];

    jest.isolateModules(() => {
      require(cliCountPath);
    });

    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename);
    expect(mockError).toHaveBeenCalledWith('Error reading JSON file:\nJSON file must contain an array');
    expect(mockExit).toHaveBeenCalledWith(4);
  });

  test('should exit with code 4 and log an error for a non-existent file', () => {
    const mockFilename = 'nonexistent.json';
    fs.readJsonSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    process.argv = [...originalArgv, mockFilename];

    jest.isolateModules(() => {
      require(cliCountPath);
    });

    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename);
    expect(mockError).toHaveBeenCalledWith('Error reading JSON file:\nENOENT: no such file or directory');
    expect(mockExit).toHaveBeenCalledWith(4);
  });

  test('should exit with code 4 and log an error for invalid JSON format', () => {
    const mockFilename = 'malformed.json';
    fs.readJsonSync.mockImplementation(() => {
      throw new Error('Unexpected token i in JSON at position 0');
    });

    process.argv = [...originalArgv, mockFilename];

    jest.isolateModules(() => {
      require(cliCountPath);
    });

    expect(fs.readJsonSync).toHaveBeenCalledWith(mockFilename);
    expect(mockError).toHaveBeenCalledWith('Error reading JSON file:\nUnexpected token i in JSON at position 0');
    expect(mockExit).toHaveBeenCalledWith(4);
  });
});
