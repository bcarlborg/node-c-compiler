const fs = require('fs')
const path = require('path')

const EXPECTED_PATH_ARGUMENT_MESSAGE = 'error: expected path to be a string'
const FILE_DOES_NOT_EXIST = 'error: file does not exist'
const CANNOT_READ_FILE = 'error: cannot read file'
const EMPTY_FILE = 'error: empty file'

async function readFileText(path) {
  if (!(typeof path === 'string' || path instanceof String)) {
    throw new Error(EXPECTED_PATH_ARGUMENT_MESSAGE)
  }

  if (!fs.existsSync(path)) {
    throw new Error(FILE_DOES_NOT_EXIST)
  }

  let fileText
  try {
    fileText = await fs.promises.readFile(path, 'utf8')
  } catch (error) {
    throw new Error(CANNOT_READ_FILE)
  }

  if (!fileText) {
    throw new Error(EMPTY_FILE)
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
