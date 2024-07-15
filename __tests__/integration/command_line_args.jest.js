const { exec } = require('child_process')

describe('command line argument behavior', () => {
  test('exits with non-zero code if no arguments passed', async () => {
    const command = 'compiler'
    const { error } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error.code > 0).toBe(true)
  })

  test('exits with non-zero code if flags but no positional arguments passed', async () => {
    const command = 'compiler --dummy --lex --debug'

    const { error } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error.code > 0).toBe(true)
    // TODO check stderr here to ensure that we are getting some sensible error on stderr
  })

  test('exits with non-zero code if input program is empty', async () => {
    const command =
      'compiler --dummy --lex --debug ./__tests__/sample_c_files/empty.c'

    const { error } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error.code > 0).toBe(true)
    // TODO check stderr here to ensure that we are getting some sensible error on stderr
  })

  test('exits with zero exit code for simple c file', async () => {
    const command = './compiler ./__tests__/sample_c_files/simple_main.c'

    const { error } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
  })
})
