const { extractCliArgsAndOptions } = require('./lib/cli_args')

function main() {
  const argAndOptions = extractCliArgsAndOptions(process.argv)
  console.log(argAndOptions)
}

main()
