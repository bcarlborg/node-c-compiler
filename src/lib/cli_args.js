const NO_ARGUMENTS_ERROR_MESSAGE =
  'SCRIPT ERROR: expected positional argument with path to file'
const UNRECOGNIZED_OPTION_MESSAGE = 'SCRIPT ERROR: unrecognized option'
const ONLY_ONE_OPTION_ALLOWED =
  'SCRIPT ERROR: only one script option is allowed'
const ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED =
  'SCRIPT ERROR: only one positional argument is allowed'
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

  // If the first arg looks like an option, shift it off the front
  // of the options array
  const option = options_and_args[0].startsWith('-')
    ? options_and_args.shift()
    : undefined

  // if we found an option, but it is not one of the recognized options, throw
  // an error.
  if (
    option &&
    !(
      option === '--lex' ||
      option === '--parse' ||
      option === '--codegen' ||
      option === '-S'
    )
  ) {
    console.error(`cannot recognize option ${option}`)
    throw new Error(UNRECOGNIZED_OPTION_MESSAGE)
  }

  if (options_and_args.length === 0) {
    throw new Error(NO_ARGUMENTS_ERROR_MESSAGE)
  }

  // At this point, we've already processed the one option if it was provided
  // so if there is another, that is an error
  if (options_and_args[0].startsWith('-')) {
    throw new Error(ONLY_ONE_OPTION_ALLOWED)
  }

  if (options_and_args.length > 1) {
    throw new Error(ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED)
  }

  const positionalArg = options_and_args[0]

  return {
    lexOption: option === '--lex',
    parseOption: option === '--parse',
    codegenOption: option === '--codegen',
    assemblyOnlyOption: option === '-S',
    arg: positionalArg,
  }
}

module.exports = {
  extractCliArgsAndOptions,
  NO_ARGUMENTS_ERROR_MESSAGE,
  UNRECOGNIZED_OPTION_MESSAGE,
  EXPECTED_ARRAY_ARGS_MESSAGE,
  ONLY_ONE_OPTION_ALLOWED,
  ONLY_ONE_POSITIONAL_ARGUMENT_ALLOWED,
}
