const NO_ARGUMENTS_ERROR_MESSAGE =
  'SCRIPT ERROR: expected positional argument with path to file'
const EXPECTED_ARRAY_ARGS_MESSAGE =
  'internal error: expected argument args to be an array'

/**
 * Processes the command line arguments passed to the compile script.
 * Throws when there is not exactly one positional argument.
 *
 * @param {string[]} args -- the command line arguments from process.argv
 * @returns {{
 *  lexOption: boolean,
 *  parseOption: boolean,
 *  codegenOption: boolean,
 *  arg: string,
 * }}
 */
function extractCliArgsAndOptions(args) {
  if (!Array.isArray(args)) {
    throw new Error(EXPECTED_ARRAY_ARGS_MESSAGE)
  }

  // The first two arguments are 'node' and the path to our script.
  // We slice them off to get to the actual arguments.
  const options_and_args = args.slice(2)

  if (!options_and_args.length) {
    throw new Error(NO_ARGUMENTS_ERROR_MESSAGE)
  }

  const foundOptions = {
    lexOption: false,
    parseOption: false,
    codegenOption: false,
    assemblyOnlyOption: false,
    debugOption: false,
  }

  //
  // shift off all options
  //
  while (options_and_args[0]?.startsWith('-')) {
    const currentOption = options_and_args.shift()

    switch (currentOption) {
      case '--lex':
        foundOptions.lexOption = true
        break
      case '--parse':
        foundOptions.parseOption = true
        break
      case '--codegen':
        foundOptions.codegenOption = true
        break
      case '-S':
        foundOptions.assemblyOnlyOption = true
        break
      case '--debug':
        foundOptions.debugOption = true
        break
    }
  }

  //
  // Process options
  //

  const lexOption = foundOptions.lexOption

  // parseOption is overridden by lex option
  const parseOption = !foundOptions.lexOption && foundOptions.parseOption

  // codegenOption overridden by lexOption and parseOption
  const codegenOption =
    !foundOptions.lexOption &&
    !foundOptions.parseOption &&
    foundOptions.codegenOption

  // assembly only option is overridden by lexOption and parseOption
  const assemblyOnlyOption =
    !foundOptions.lexOption &&
    !foundOptions.parseOption &&
    !foundOptions.codegenOption &&
    foundOptions.assemblyOnlyOption

  const debugOption = foundOptions.debugOption

  //
  // Get positional arg
  //

  // if after shifting all the options off, there is nothing left
  // then there are no arguments
  if (options_and_args.length === 0) {
    throw new Error(NO_ARGUMENTS_ERROR_MESSAGE)
  }

  const positionalArg = options_and_args[0]

  //
  // return
  //

  return {
    lexOption,
    parseOption,
    codegenOption,
    assemblyOnlyOption,
    debugOption,
    arg: positionalArg,
  }
}

module.exports = {
  extractCliArgsAndOptions,
  EXPECTED_ARRAY_ARGS_MESSAGE,
  NO_ARGUMENTS_ERROR_MESSAGE,
}
