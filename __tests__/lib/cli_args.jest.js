const cliArgs = require('../../src/lib/cli_args')
const {
  extractCliArgsAndOptions,
  NO_ARGUMENTS_ERROR_MESSAGE,
  EXPECTED_ARRAY_ARGS_MESSAGE,
} = cliArgs

describe('processing cli args', () => {
  describe('invalid argument count', () => {
    test('throws an error when args is not passed', () => {
      expect(() => extractCliArgsAndOptions()).toThrow(
        EXPECTED_ARRAY_ARGS_MESSAGE,
      )
    })

    test('throws an error when multiple options and no argument is passed', () => {
      const args = ['node', 'script_name', '--lex', '--parse']
      expect(() => extractCliArgsAndOptions(args)).toThrow(
        NO_ARGUMENTS_ERROR_MESSAGE,
      )
    })

    test('throws an error when an unrecognized option is passed with no argument either', () => {
      const args = ['node', 'script_name', '--I-dunno']
      expect(() => extractCliArgsAndOptions(args)).toThrow(
        NO_ARGUMENTS_ERROR_MESSAGE,
      )
    })

    test('ignores all positional arguments after first', () => {
      const args = ['node', 'script_name', 'path1', 'path2']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: false,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: false,
        arg: 'path1',
      })
    })

    test('ignores all positional arguments after first when options are provided as well', () => {
      const args = ['node', 'script_name', '--junk', '--lex', 'path1', 'path2']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: true,
        parseOption: false,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: false,
        arg: 'path1',
      })
    })
  })

  describe('lex', () => {
    test('--lex and --debug can be recognized together', () => {
      const args = ['node', 'script_name', '--debug', '--lex', 'path1']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: true,
        parseOption: false,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: true,
        arg: 'path1',
      })
    })

    test('--lex overrides all other options we', () => {
      const args = [
        'node',
        'script_name',
        '--codegen',
        '-S',
        '--lex',
        '--parse',
        'path1',
      ]
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: true,
        parseOption: false,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: false,
        arg: 'path1',
      })
    })
  })

  describe('--parse', () => {
    test('--parse and --debug can be recognized together', () => {
      const args = ['node', 'script_name', '--parse', '--debug', 'path1']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: true,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: true,
        arg: 'path1',
      })
    })

    test('--parse overrides following lifecycle options can be recognized together', () => {
      const args = [
        'node',
        'script_name',
        '-S',
        '--codegen',
        '--parse',
        '--debug',
        'path1',
      ]
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: true,
        codegenOption: false,
        assemblyOnlyOption: false,
        debugOption: true,
        arg: 'path1',
      })
    })
  })

  describe('--codegen', () => {
    test('--codegen and --debug can be recognized together', () => {
      const args = ['node', 'script_name', '--codegen', '--debug', 'path1']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: false,
        codegenOption: true,
        assemblyOnlyOption: false,
        debugOption: true,
        arg: 'path1',
      })
    })

    test('--codegen overrides following lifecycle options can be recognized together', () => {
      const args = ['node', 'script_name', '-S', '--codegen', 'path1']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: false,
        codegenOption: true,
        assemblyOnlyOption: false,
        debugOption: false,
        arg: 'path1',
      })
    })
  })

  describe('-S', () => {
    test('-S is recognized as assembly only', () => {
      const args = ['node', 'script_name', '-S', 'path1']
      expect(extractCliArgsAndOptions(args)).toEqual({
        lexOption: false,
        parseOption: false,
        codegenOption: false,
        assemblyOnlyOption: true,
        debugOption: false,
        arg: 'path1',
      })
    })
  })
})
