const { TOKEN_TYPE } = require('../../src/lib/lexer')
const parser = require('../../src/lib/parser')
const { parse, NODE_TYPE, ParseError, ERROR_MESSAGES } = parser

describe('parser tests', () => {
  describe('parse()', () => {
    test('returns an empty program node when no tokens are provided', () => {
      const tokens = []
      const result = parse(tokens)
      expect(result).toEqual({ type: NODE_TYPE.PROGRAM })
    })

    describe('function parsing', () => {
      let valid_function_tokens

      beforeEach(() => {
        valid_function_tokens = [
          {
            type: TOKEN_TYPE.INT,
          },
          {
            type: TOKEN_TYPE.IDENTIFIER,
            name: 'my_function',
          },
          {
            type: TOKEN_TYPE.OPEN_PAREN,
          },
          {
            type: TOKEN_TYPE.VOID,
          },
          {
            type: TOKEN_TYPE.CLOSE_PAREN,
          },
          {
            type: TOKEN_TYPE.OPEN_BRACE,
          },
          {
            type: TOKEN_TYPE.RETURN,
          },
          {
            type: TOKEN_TYPE.CONSTANT,
            constant: '999',
          },
          {
            type: TOKEN_TYPE.SEMICOLON,
          },
          {
            type: TOKEN_TYPE.CLOSE_BRACE,
          },
        ]
      })

      it('parses a simple function', () => {
        const tokens = [...valid_function_tokens]
        const result = parse(tokens)

        expect(result).toEqual({
          type: NODE_TYPE.PROGRAM,
          functionNode: {
            type: NODE_TYPE.FUNCTION_DECLARATION,
            returnType: { type: TOKEN_TYPE.INT },
            functionName: { type: TOKEN_TYPE.IDENTIFIER, name: 'my_function' },
            args: { type: TOKEN_TYPE.VOID },
            bodyStatement: {
              type: NODE_TYPE.RETURN_STATEMENT,
              expression: {
                type: NODE_TYPE.CONSTANT_EXPRESSION,
                constant: { type: TOKEN_TYPE.CONSTANT, constant: '999' },
              },
            },
          },
        })
      })

      it('throws an error if the function has no return type', () => {
        // remove the return type token from valid tokens
        const tokens = [...valid_function_tokens]
        tokens.splice(0, 1)

        expect(() => parse(tokens)).toThrow(
          new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_RETURN_TYPE),
        )
      })

      it('throws an error if there is no function name', () => {
        const tokens = [...valid_function_tokens]
        // remove function name from tokens
        tokens.splice(1, 1)

        expect(() => parse(tokens)).toThrow(
          new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_NAME_IDENTIFIER),
        )
      })
    })
  })
})
