const { extractCliArgsAndOptions } = require('./lib/cli_args')
const { readFileText } = require('./lib/file_utils')
const { lex } = require('./lib/lexer')

async function main() {
  const argAndOptions = extractCliArgsAndOptions(process.argv)
  const fileText = await readFileText(argAndOptions.arg)
  const tokens = lex(fileText)
}

main()
