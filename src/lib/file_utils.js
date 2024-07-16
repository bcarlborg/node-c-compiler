const fs = require('fs')

const { FatalError } = require('./errors')

const EXPECTED_PATH_ARGUMENT_MESSAGE = 'error: expected path to be a string'
const FILE_DOES_NOT_EXIST = 'error: file does not exist'
const CANNOT_READ_FILE = 'error: cannot read file'
const EMPTY_FILE = 'error: empty file'

async function readFileText(path) {
  if (!(typeof path === 'string' || path instanceof String)) {
    throw new FatalError(EXPECTED_PATH_ARGUMENT_MESSAGE)
  }

  if (!fs.existsSync(path)) {
    throw new FatalError(FILE_DOES_NOT_EXIST)
  }

  let fileText
  try {
    fileText = await fs.promises.readFile(path, 'utf8')
  } catch (_error) {
    throw new FatalError(CANNOT_READ_FILE)
  }

  if (!fileText) {
    new FatalError(EMPTY_FILE)
  }

  return fileText
}

module.exports = {
  readFileText,
  EXPECTED_PATH_ARGUMENT_MESSAGE,
  FILE_DOES_NOT_EXIST,
  CANNOT_READ_FILE,
  EMPTY_FILE,
}
