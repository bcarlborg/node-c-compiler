const fs = require('fs')

const file_utils = require('../../src/lib/file_utils')
const {
  readFileText,
  EXPECTED_PATH_ARGUMENT_MESSAGE,
  FILE_DOES_NOT_EXIST,
  CANNOT_READ_FILE,
  EMPTY_FILE,
} = file_utils

describe('readFileText', () => {
  let readFileSpy
  beforeEach(() => {
    readFileSpy = jest.spyOn(fs.promises, 'readFile')
  })

  afterEach(() => {
    readFileSpy.mockRestore()
  })

  test('throws error if no path is given', async () => {
    await expect(readFileText()).rejects.toThrow(EXPECTED_PATH_ARGUMENT_MESSAGE)
  })

  test('throws error if junk path is given', async () => {
    await expect(readFileText(10)).rejects.toThrow(
      EXPECTED_PATH_ARGUMENT_MESSAGE,
    )
  })

  test('throws error if path to non-existent file is given', async () => {
    await expect(readFileText('./i-do-not-exist')).rejects.toThrow(
      FILE_DOES_NOT_EXIST,
    )
  })

  test('throws error if path to non-existent file is given', async () => {
    readFileSpy.mockRejectedValue(new Error('error'))

    await expect(
      readFileText('./__tests__/sample_c_files/simple_main.c'),
    ).rejects.toThrow(CANNOT_READ_FILE)
  })

  test('returns file text for existing file', async () => {
    const text = await readFileText('./__tests__/sample_c_files/simple_main.c')
    expect(text).toEqual('int main(void) {\n  return 2;\n}')
  })
})
