const { extractCliArgsAndOptions } = require('./lib/cli_args')
const { readFileText } = require('./lib/file_utils')

async function main() {
  const argAndOptions = extractCliArgsAndOptions(process.argv)
  const fileText = await readFileText(argAndOptions.arg)
  console.log('file text', fileText)
}

main()
