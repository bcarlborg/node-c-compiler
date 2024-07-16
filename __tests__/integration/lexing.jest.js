const { exec } = require('child_process')

describe('lexing integration tests', () => {
  test('exits with zero exit code for simple c file', async () => {
    const command = './compiler --lex ./__tests__/sample_c_files/simple_main.c'

    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
    expect(stderr).toBe('')
  })

  test('prints tokens for simpl c program when --debug is used', async () => {
    const command =
      './compiler --lex --debug ./__tests__/sample_c_files/simple_main.c'

    const { error, stdout, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toContain(
      '<type: int> <type: identifier name: main> <type: open_paren> <type: void> ' +
        '<type: close_paren> <type: open_brace> <type: return> ' +
        '<type: constant constant: 2> <type: semicolon> <type: close_brace>',
    )
  })
})
