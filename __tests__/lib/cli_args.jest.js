const cliArgs = require('../../src/lib/cli_args')
const {
  extractCliArgsAndOptions,
  NO_ARGUMENTS_ERROR_MESSAGE,
  EXPECTED_ARRAY_ARGS_MESSAGE,
  UNRECOGNIZED_OPTION_MESSAGE,
  ONLY_ONE_OPTION_ALLOWED,
  ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED,
} = cliArgs

describe('processing cli args', () => {
  test('throws an error when args is not passed', () => {
    expect(() => extractCliArgsAndOptions()).toThrow(
      EXPECTED_ARRAY_ARGS_MESSAGE,
    )
  })

  test('throws an error when no options or positional arguments are passed', () => {
    const args = ['node', 'script_name']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      NO_ARGUMENTS_ERROR_MESSAGE,
    )
  })

  test('throws an error when an option but no positional argument is passed', () => {
    const args = ['node', 'script_name', '--lex']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      NO_ARGUMENTS_ERROR_MESSAGE,
    )
  })

  test('throws an error when an unrecognized option is passed', () => {
    const args = ['node', 'script_name', '--I-dunno', 'path1']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      UNRECOGNIZED_OPTION_MESSAGE,
    )
  })

  test('throws an error when an unrecognized option is passed with no argument either', () => {
    const args = ['node', 'script_name', '--I-dunno']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      UNRECOGNIZED_OPTION_MESSAGE,
    )
  })

  test('throws an error when multiple options are passed', () => {
    const args = ['node', 'script_name', '--lex', '--parse', 'path1']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      ONLY_ONE_OPTION_ALLOWED,
    )
  })

  test('throws an error when multiple options and no argument is passed', () => {
    const args = ['node', 'script_name', '--lex', '--parse']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      ONLY_ONE_OPTION_ALLOWED,
    )
  })

  test('throws an error when multiple positional arguments are passed without options', () => {
    const args = ['node', 'script_name', 'path1', 'path2']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED,
    )
  })

  test('throws an error when multiple positional arguments and an option are passed', () => {
    const args = ['node', 'script_name', '--lex', 'path1', 'path2']
    expect(() => extractCliArgsAndOptions(args)).toThrow(
      ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED,
    )
  })

  test('returns the path of the positional argument in args when no options are provided', () => {
    const args = ['node', 'script_name', 'path1']
    expect(extractCliArgsAndOptions(args)).toEqual({
      lexOption: false,
      parseOption: false,
      codegenOption: false,
      assemblyOnlyOption: false,
      arg: 'path1',
    })
  })

  test('returns the path and lex option', () => {
    const args = ['node', 'script_name', '--lex', 'path1']
    expect(extractCliArgsAndOptions(args)).toEqual({
      lexOption: true,
      parseOption: false,
      codegenOption: false,
      assemblyOnlyOption: false,
      arg: 'path1',
    })
  })

  test('returns the path and parse option', () => {
    const args = ['node', 'script_name', '--parse', 'path1']
    expect(extractCliArgsAndOptions(args)).toEqual({
      lexOption: false,
      parseOption: true,
      codegenOption: false,
      assemblyOnlyOption: false,
      arg: 'path1',
    })
  })

  test('returns the path and codegen option', () => {
    const args = ['node', 'script_name', '--codegen', 'path1']
    expect(extractCliArgsAndOptions(args)).toEqual({
      lexOption: false,
      parseOption: false,
      codegenOption: true,
      assemblyOnlyOption: false,
      arg: 'path1',
    })
  })

  test('returns the path and assembly only ption', () => {
    const args = ['node', 'script_name', '-S', 'path1']
    expect(extractCliArgsAndOptions(args)).toEqual({
      lexOption: false,
      parseOption: false,
      codegenOption: false,
      assemblyOnlyOption: true,
      arg: 'path1',
    })
  })
})
