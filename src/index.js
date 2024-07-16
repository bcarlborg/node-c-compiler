const { extractCliArgsAndOptions } = require('./lib/cli_args')
const { logErrorAndExit } = require('./lib/errors')
const { readFileText } = require('./lib/file_utils')
const { lex, tokensToString } = require('./lib/lexer')

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

  const tokens = lex(fileText)

  if (argAndOptions?.debugOption) {
    const tokenString = tokensToString(tokens)
    console.log('====== TOKENS ======')
    console.log(tokenString)
  }

  // if lex option was passed, we should exit after lexing
  if (argAndOptions.lexOption) {
    return
  }
}

mainWithLogging()
