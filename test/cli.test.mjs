import yargs from 'yargs';

describe('yargs configuration behavior tests', () => {
  let consoleErrorSpy, consoleLogSpy;

  beforeEach(() => {
    // Mock console methods to capture output
    consoleErrorSpy = import.meta.jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = import.meta.jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore mocks
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  function createParser() {
    const yargsInstance = yargs();

    return yargsInstance
      .wrap(yargsInstance.terminalWidth())
      .version('1.0.0')
      .usage('Usage: $0 <command> [options]')
      .strict()
      .alias({ h: 'help', v: 'version' })
      .demandCommand(1, 'At least one command required')
      .group(['host', 'port'], 'Server Options')
      .parserConfiguration({
        'boolean-negation': false,
        'camel-case-expansion': false,
        'dot-notation': true,
      })
      .strictOptions()
      .command('start', 'Start the server', (yargsCmd) =>
        yargsCmd
          .option('port', {
            describe: 'Port number',
            type: 'number',
          })
          .option('host', {
            describe: 'Server host',
            default: 'localhost',
          }),
      )
      .coerce('port', (arg) => {
        const port = parseInt(arg, 10);
        if (Number.isNaN(port)) throw new Error('Invalid port');
        return port;
      })
      .check((argv) => {
        if (argv.port && (argv.port < 1 || argv.port > 65535)) {
          throw new Error('Port out of range');
        }
        return true;
      })
      .example('$0 start --port 3000', 'Start server on port 3000')
      .exitProcess(false); // Prevent process exit during tests
  }

  // Helper function to safely parse arguments without unused vars
  function safeParse(parser, args) {
    try {
      return parser.parse(args);
    } catch (e) {
      void e;
      return null;
    }
  }

  test('parses valid arguments correctly and returns expected properties', () => {
    const parser = createParser();
    const argv = parser.parse(['start', '--port', '3000', '--host', '127.0.0.1']);

    // Assert specific properties that indicate successful parsing
    expect(argv).toBeDefined();
    expect(argv).not.toBeNull();
    expect(argv._[0]).toBe('start');
    expect(argv.port).toBe(3000);
    expect(argv.host).toBe('127.0.0.1');
    expect(argv.$0).toContain('jest');
  });

  test('generates help output containing key elements', () => {
    const parser = createParser();
    safeParse(parser, ['--help']);
    const helpOutput = consoleLogSpy.mock.calls.join('\n');

    // Assert that the help output contains expected strings
    expect(helpOutput).toMatch(/Usage: .* <command> \[options\]/);
    expect(helpOutput).toContain('Commands:');
    expect(helpOutput).toContain('start');
    expect(helpOutput).toContain('--port');
    expect(helpOutput).toContain('--host');
    expect(helpOutput).toContain('Options:');
    expect(helpOutput).toContain('--help');
    expect(helpOutput).toContain('--version');
  });

  test('handles invalid commands and outputs an error', () => {
    const parser = createParser();
    safeParse(parser, ['invalid-command']);
    const errorOutput = consoleErrorSpy.mock.calls.join('\n');

    // Assert that an error was logged and contains a specific message
    expect(errorOutput).toContain('Unknown argument: invalid-command');
    expect(consoleErrorSpy).toHaveBeenCalled(); // Ensure error was actually logged
  });

  test('validates options correctly and outputs an error for invalid port type', () => {
    const parser = createParser();
    safeParse(parser, ['start', '--port', 'invalid']);
    const errorOutput = consoleErrorSpy.mock.calls.join('\n');

    // Assert the error message for invalid port
    expect(errorOutput).toContain('Invalid port');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('applies coercion and checks, outputting error for out-of-range port', () => {
    const parser = createParser();
    safeParse(parser, ['start', '--port', '70000']);
    const errorOutput = consoleErrorSpy.mock.calls.join('\n');

    // Assert the error message for out-of-range port
    expect(errorOutput).toContain('Port out of range');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('shows version information correctly', () => {
    const parser = createParser();
    safeParse(parser, ['--version']);
    const versionOutput = consoleLogSpy.mock.calls.join('\n');

    // Assert that the version output contains the expected version number
    expect(versionOutput).toContain('1.0.0');
    expect(consoleLogSpy).toHaveBeenCalled();
  });
});
