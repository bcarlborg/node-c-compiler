const lexer = require('../../src/lib/lexer')
const {
  lex,
  tokensToString,
  TOKEN_TYPE,
  UNRECOGNIZABLE_TOKEN_MESSAGE,
  EXPECTED_TOKENS_MESSAGE,
} = lexer

describe('lexer', () => {
  describe('lex', () => {
    test('returns an empty array for an empty source string', () => {
      const result = lex('')
      expect(result).toEqual([])
    })

    describe('basic keywords', () => {
      test('identifies ( token', () => {
        const result = lex('(')
        expect(result).toEqual([{ type: TOKEN_TYPE.OPEN_PAREN }])
      })

      test('identifies ) token', () => {
        const result = lex(')')
        expect(result).toEqual([{ type: TOKEN_TYPE.CLOSE_PAREN }])
      })

      test('identifies { token', () => {
        const result = lex('{')
        expect(result).toEqual([{ type: TOKEN_TYPE.OPEN_BRACE }])
      })

      test('identifies } token', () => {
        const result = lex('}')
        expect(result).toEqual([{ type: TOKEN_TYPE.CLOSE_BRACE }])
      })

      test('identifies ; token', () => {
        const result = lex(';')
        expect(result).toEqual([{ type: TOKEN_TYPE.SEMICOLON }])
      })

      test('identifies + token', () => {
        const result = lex('+')
        expect(result).toEqual([{ type: TOKEN_TYPE.PLUS }])
      })

      test('identifies - token', () => {
        const result = lex('-')
        expect(result).toEqual([{ type: TOKEN_TYPE.MINUS }])
      })

      test('identifies < token', () => {
        const result = lex('<')
        expect(result).toEqual([{ type: TOKEN_TYPE.LESS_THAN }])
      })

      test('identifies > token', () => {
        const result = lex('>')
        expect(result).toEqual([{ type: TOKEN_TYPE.GREATER_THAN }])
      })
    })

    describe('multi-char operators', () => {
      test('identifies >= operator', () => {
        expect(lex('>=')).toEqual([{ type: TOKEN_TYPE.GREATER_THAN_OR_EQUAL }])
      })

      test('identifies <= operator', () => {
        expect(lex('<=')).toEqual([{ type: TOKEN_TYPE.LESS_THAN_OR_EQUAL }])
      })
    })

    describe('keywords', () => {
      test('identifies int token', () => {
        const result = lex('int')
        expect(result).toEqual([{ type: TOKEN_TYPE.INT }])
      })

      test('identifies if token', () => {
        const result = lex('if')
        expect(result).toEqual([{ type: TOKEN_TYPE.IF }])
      })

      test('identifies void token', () => {
        const result = lex('void')
        expect(result).toEqual([{ type: TOKEN_TYPE.VOID }])
      })

      test('identifies return token', () => {
        const result = lex('return')
        expect(result).toEqual([{ type: TOKEN_TYPE.RETURN }])
      })
    })

    describe('basic identifiers', () => {
      test('identifies single char identifier token', () => {
        const result = lex('i')
        expect(result).toEqual([{ type: TOKEN_TYPE.IDENTIFIER, name: 'i' }])
      })

      test('identifies identifier token', () => {
        const result = lex('beau')
        expect(result).toEqual([{ type: TOKEN_TYPE.IDENTIFIER, name: 'beau' }])
      })

      test('allows names starting with underscores', () => {
        const result = lex('___beau')
        expect(result).toEqual([
          { type: TOKEN_TYPE.IDENTIFIER, name: '___beau' },
        ])
      })

      test('allows names with numbers internally', () => {
        const result = lex('b0_b')
        expect(result).toEqual([{ type: TOKEN_TYPE.IDENTIFIER, name: 'b0_b' }])
      })

      test('takes the longest munch of identifier names ignoring int keyword prefixes', () => {
        const result = lex('integer')
        expect(result).toEqual([
          { type: TOKEN_TYPE.IDENTIFIER, name: 'integer' },
        ])
      })

      test('takes the longest munch of identifier names ignoring if keyword prefixes', () => {
        const result = lex('iffy')
        expect(result).toEqual([{ type: TOKEN_TYPE.IDENTIFIER, name: 'iffy' }])
      })
    })

    describe('constant numbers', () => {
      test('identifies simple integer constants', () => {
        const result = lex('9999')
        expect(result).toEqual([
          { type: TOKEN_TYPE.CONSTANT, constant: '9999' },
        ])
      })
    })

    describe('multi token sequences', () => {
      test('identifies multiple tokens separated by various kinds of spaces', () => {
        const result = lex('+   -  \n \t foobar \t\t\t int >=')
        expect(result).toEqual([
          { type: TOKEN_TYPE.PLUS },
          {
            type: TOKEN_TYPE.MINUS,
          },
          {
            type: TOKEN_TYPE.IDENTIFIER,
            name: 'foobar',
          },
          { type: TOKEN_TYPE.INT },
          { type: TOKEN_TYPE.GREATER_THAN_OR_EQUAL },
        ])
      })

      test('identifies multiple tokens not separated by spaces', () => {
        const result = lex('>>=>')
        expect(result).toEqual([
          { type: TOKEN_TYPE.GREATER_THAN },
          {
            type: TOKEN_TYPE.GREATER_THAN_OR_EQUAL,
          },
          {
            type: TOKEN_TYPE.GREATER_THAN,
          },
        ])
      })

      test('identifies operators right next to identifiers', () => {
        const result = lex('>beau-')
        expect(result).toEqual([
          { type: TOKEN_TYPE.GREATER_THAN },
          {
            type: TOKEN_TYPE.IDENTIFIER,
            name: 'beau',
          },
          {
            type: TOKEN_TYPE.MINUS,
          },
        ])
      })

      test('identifies simple function declaration', () => {
        const result = lex('int main() {}')
        expect(result).toEqual([
          { type: TOKEN_TYPE.INT },
          {
            type: TOKEN_TYPE.IDENTIFIER,
            name: 'main',
          },
          {
            type: TOKEN_TYPE.OPEN_PAREN,
          },
          {
            type: TOKEN_TYPE.CLOSE_PAREN,
          },
          {
            type: TOKEN_TYPE.OPEN_BRACE,
          },
          {
            type: TOKEN_TYPE.CLOSE_BRACE,
          },
        ])
      })
    })

    describe('throws unknown token type for an unrecognizable token', () => {
      test('throws for junk symbol', () => {
        expect(() => lex('#')).toThrow(UNRECOGNIZABLE_TOKEN_MESSAGE)
      })

      test('throws for junk at end of identifier', () => {
        expect(() => lex('foobar#')).toThrow(UNRECOGNIZABLE_TOKEN_MESSAGE)
      })

      test('throws for junk identifier', () => {
        expect(() => lex('9a')).toThrow(UNRECOGNIZABLE_TOKEN_MESSAGE)
      })
    })
  })

  describe('tokensToString', () => {
    test('throws an error if tokens is undefined', () => {
      expect(() => tokensToString()).toThrow(EXPECTED_TOKENS_MESSAGE)
    })

    test('returns an empty string for an empty array of tokens', () => {
      const tokens = []
      const result = tokensToString(tokens)
      expect(result).toEqual('')
    })

    test('returns correct token string for identifiers and constants and keywords', () => {
      const tokens = [
        { type: TOKEN_TYPE.IDENTIFIER, name: 'foobar' },
        { type: TOKEN_TYPE.CONSTANT, constant: '999' },
        { type: TOKEN_TYPE.INT },
      ]
      const result = tokensToString(tokens)
      expect(result).toEqual(
        '<type: identifier name: foobar> <type: constant constant: 999> <type: int>',
      )
    })
  })
})
