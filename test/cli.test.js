const yargs = require('yargs/yargs');

describe('yargs configuration snapshot tests', () => {
  let consoleErrorSpy, consoleLogSpy;

  beforeEach(() => {
    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore mocks
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  function createParser() {
    return yargs([])
      .wrap(yargs.terminalWidth())
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
      .command('start', 'Start the server', (yargs) =>
        yargs
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
    } catch {
      // Suppress errors intentionally
      return null;
    }
  }

  test('parses valid arguments correctly', () => {
    const parser = createParser();
    const argv = parser.parse(['start', '--port', '3000']);
    expect(argv).toMatchSnapshot();
  });

  test('generates consistent help output', () => {
    const parser = createParser();
    safeParse(parser, ['--help']);
    expect(consoleLogSpy.mock.calls.join('\n')).toMatchSnapshot();
  });

  test('handles invalid commands correctly', () => {
    const parser = createParser();
    safeParse(parser, ['invalid-command']);
    expect(consoleErrorSpy.mock.calls.join('\n')).toMatchSnapshot();
  });

  test('validates options correctly', () => {
    const parser = createParser();
    safeParse(parser, ['start', '--port', 'invalid']);
    expect(consoleErrorSpy.mock.calls.join('\n')).toMatchSnapshot();
  });

  test('applies coercion and checks', () => {
    const parser = createParser();
    safeParse(parser, ['start', '--port', '70000']);
    expect(consoleErrorSpy.mock.calls.join('\n')).toMatchSnapshot();
  });

  test('shows version information', () => {
    const parser = createParser();
    safeParse(parser, ['--version']);
    expect(consoleLogSpy.mock.calls.join('\n')).toMatchSnapshot();
  });
});
