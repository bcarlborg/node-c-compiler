const { exec } = require('child_process')

describe('command line argument behavior', () => {
  test('exits with non-zero code if no arguments passed', async () => {
    const command = './compiler'
    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error?.code > 0).toBe(true)
    expect(stderr).toContain(
      'Fatal Error: Lexer Error: expected positional argument with path to file',
    )
  })

  test('exits with non-zero code if flags but no positional arguments passed', async () => {
    const command = './compiler --dummy --lex --debug'

    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error.code > 0).toBe(true)
    expect(stderr).toContain(
      'Fatal Error: Lexer Error: expected positional argument with path to file',
    )
  })

  test('exits with zero exit code for simple c file', async () => {
    const command =
      './compiler ./__tests__/sample_c_files/valid_programs/simple_main.c'

    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
    expect(stderr).toBe('')
  })

  test.todo('does something if the program is empty')
})
