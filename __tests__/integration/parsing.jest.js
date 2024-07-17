const { exec } = require('child_process')

describe('parsing integration tests', () => {
  test('exits with zero exit code for simple c file', async () => {
    const command =
      './compiler --parse ./__tests__/sample_c_files/valid_programs/simple_main.c'

    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
    expect(stderr).toBe('')
  })

  test('prints ast for simple c program when --debug is used', async () => {
    const command =
      './compiler --parse --debug ./__tests__/sample_c_files/valid_programs/simple_main.c'

    const { error, stdout, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    // error value of null indicates successful run and exit code of zero
    expect(error).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toContain(
      '====== TOKENS ======\n' +
        '<type: int> <type: identifier name: main> <type: open_paren> <type: void> ' +
        '<type: close_paren> <type: open_brace> <type: return> ' +
        '<type: constant constant: 2> <type: semicolon> <type: close_brace>',
    )

    expect(stdout).toContain(
      '====== AST ======\n' +
        'Program(\n' +
        '  FunctionDeclaration(\n' +
        '    returnType: int\n' +
        '    functionName: main\n' +
        '    args: void\n' +
        '    ReturnStatement(\n' +
        '      Constant([object Object])\n' +
        '    )\n' +
        '  )\n' +
        ')\n',
    )
  })

  test('exits with non-zero code and errors for invalid parse', async () => {
    const command =
      './compiler --parse ./__tests__/sample_c_files/invalid_programs/missing_semicolon.c'

    const { error, stderr } = await new Promise((resolve, _reject) => {
      exec(command, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })

    expect(error.code > 0).toBe(true)
    expect(stderr).toContain(
      'Fatal Error: Parse Error: cannot parse return statement, expected semicolon',
    )
  })
})
