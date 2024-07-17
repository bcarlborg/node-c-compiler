const { extractCliArgsAndOptions } = require('./lib/cli_args')
const { logErrorAndExit, FatalError } = require('./lib/errors')
const { readFileText } = require('./lib/file_utils')
const { lex, tokensToString } = require('./lib/lexer')
const { parse, astToString } = require('./lib/parser')

async function mainWithLogging() {
  try {
    await main()
  } catch (error) {
    logErrorAndExit(error)
  }
}

async function main() {
  const argAndOptions = extractCliArgsAndOptions(process.argv)

  //
  // Get file text
  //

  const fileText = await readFileText(argAndOptions.arg)

  if (argAndOptions?.debugOption) {
    console.log('====== INPUT PROGRAM TEXT ======')
    console.log(fileText)
  }

  //
  // Lex the file text
  //

  let tokens
  try {
    tokens = lex(fileText)
  } catch (error) {
    throw new FatalError(error.message)
  }

  if (argAndOptions?.debugOption) {
    const tokenString = tokensToString(tokens)
    console.log('====== TOKENS ======')
    console.log(tokenString)
  }

  //
  // if lex option was passed, we should exit after lexing
  //
  if (argAndOptions.lexOption) {
    return
  }

  let ast

  try {
    ast = parse(tokens)
  } catch (error) {
    throw new FatalError(error.message)
  }

  if (argAndOptions?.debugOption) {
    const astString = astToString(ast)
    console.log('====== AST ======')
    console.log(astString)
    console.log()
  }

  //
  // if the parse option was passed, we should exit after parsing
  //
  if (argAndOptions.parseOption) {
    return
  }
}

mainWithLogging()
