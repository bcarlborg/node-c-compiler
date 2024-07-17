class LexError extends Error {
  constructor(message) {
    super('Lex Error: ' + message)
  }
}

const TOKEN_TYPE = {
  OPEN_PAREN: 'open_paren',
  CLOSE_PAREN: 'close_paren',
  OPEN_BRACE: 'open_brace',
  CLOSE_BRACE: 'close_brace',
  SEMICOLON: 'semicolon',
  PLUS: 'plus',
  MINUS: 'minus',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_THAN_OR_EQUAL: 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL: 'less_than_or_equal',
  IF: 'if',
  INT: 'int',
  VOID: 'void',
  RETURN: 'return',
  CONSTANT: 'constant',
  IDENTIFIER: 'identifier',
}

const ERROR_MESSAGES = {
  UNRECOGNIZABLE_TOKEN_MESSAGE: 'unrecognizable token',
  EXPECTED_TOKENS_MESSAGE: 'expected tokens',
}

function lex(src) {
  const tokens = []

  let current_index = 0

  function isAtEnd() {
    return current_index >= src.length
  }

  function peekChar(n) {
    if (!n) {
      return src[current_index]
    }

    const peekIndex = current_index + n

    if (peekIndex >= src.length) {
      return undefined
    }

    return src[peekIndex]
  }

  function peekString(n) {
    if (!n) {
      throw new LexError('peek string requires an argument n')
    }

    if (current_index + n < src.length) {
      return src.slice(current_index, current_index + n)
    } else {
      return src.slice(current_index)
    }
  }

  /**
   * Munch n characters. If n is 1, munches current.
   */
  function munch(n) {
    if (!n) {
      throw new LexError('Munch Expects an integer')
    }

    const substring = src.slice(current_index, current_index + n)
    current_index += n

    return substring
  }

  function isWhiteSpace(c) {
    return /^\s$/.test(c)
  }

  function isNumeric(c) {
    return /^\d$/.test(c)
  }

  function isAlphaLowerCase(c) {
    return /^[a-z]$/.test(c)
  }

  function isAlphaUpperCase(c) {
    return /^[A-Z]$/.test(c)
  }

  function isAlphaAnyCase(c) {
    return isAlphaUpperCase(c) || isAlphaLowerCase(c)
  }

  function isIdentifierStartCharacter(c) {
    return isAlphaAnyCase(c) || c === '_'
  }

  function isIdentifierInnerCharacter(c) {
    return isAlphaAnyCase(c) || isNumeric(c) || c === '_'
  }

  function isBoundaryCharacter(c) {
    return !isIdentifierInnerCharacter(c)
  }

  function singleCharTokenType(c) {
    switch (c) {
      case '(':
        return TOKEN_TYPE.OPEN_PAREN
      case ')':
        return TOKEN_TYPE.CLOSE_PAREN
      case '{':
        return TOKEN_TYPE.OPEN_BRACE
      case '}':
        return TOKEN_TYPE.CLOSE_BRACE
      case ';':
        return TOKEN_TYPE.SEMICOLON
      case '+':
        return TOKEN_TYPE.PLUS
      case '-':
        return TOKEN_TYPE.MINUS
      case '>':
        return TOKEN_TYPE.GREATER_THAN
      case '<':
        return TOKEN_TYPE.LESS_THAN
      default:
        return undefined
    }
  }

  function doubleCharTokenType(s) {
    switch (s) {
      case '>=':
        return TOKEN_TYPE.GREATER_THAN_OR_EQUAL
      case '<=':
        return TOKEN_TYPE.LESS_THAN_OR_EQUAL
      default:
        return undefined
    }
  }

  function peekMultiCharTokenType() {
    // two char peek
    let length = 2
    let subString = peekString(length)
    switch (subString) {
      case 'if':
        return {
          type: TOKEN_TYPE.IF,
          length,
        }
    }

    // three char peek
    length = 3
    subString = peekString(length)
    switch (subString) {
      case 'int':
        return {
          type: TOKEN_TYPE.INT,
          length,
        }
    }

    // four char peek
    length = 4
    subString = peekString(length)
    switch (subString) {
      case 'void':
        return {
          type: TOKEN_TYPE.VOID,
          length,
        }
    }

    // four char peek
    length = 6
    subString = peekString(length)
    switch (subString) {
      case 'return':
        return {
          type: TOKEN_TYPE.RETURN,
          length: 6,
        }
    }

    return undefined
  }

  while (!isAtEnd()) {
    //
    // Ignore white space
    //
    if (isWhiteSpace(peekChar())) {
      munch(1)
      continue
    }

    //
    // Ignore from start of comment to end of comment
    //
    if (peekChar() === '/' && peekChar(1) === '*') {
      // consume /*
      munch(2)

      let runner = 0
      while (
        peekChar(runner) !== '*' &&
        peekChar(runner + 1) !== '/' &&
        current_index + runner + 1 <= src.length
      ) {
        runner += 1
      }

      console.log('testy', current_index, runner)
      munch(runner + 2)
      continue
    }

    //
    // Ignore from start of comment to end of line
    //
    if (peekChar() === '/' && peekChar(1) === '/') {
      // consume //
      munch(2)

      let runner = 0
      while (peekChar(runner) !== '\n' && current_index + runner < src.length) {
        runner += 1
      }

      munch(runner + 1)
      continue
    }

    //
    // look for any two character operators
    //
    const twoCharTokenType = doubleCharTokenType(peekString(2))
    if (twoCharTokenType) {
      tokens.push({
        type: twoCharTokenType,
      })
      munch(2)
      continue
    }

    //
    // look for any one character operators
    //
    const oneCharTokenType = singleCharTokenType(peekChar())
    if (oneCharTokenType) {
      tokens.push({
        type: oneCharTokenType,
      })
      munch(1)
      continue
    }

    //
    // look for any multi character keywords
    //
    const manyCharTokenTypeWithLength = peekMultiCharTokenType()
    if (
      manyCharTokenTypeWithLength &&
      !isIdentifierInnerCharacter(peekChar(manyCharTokenTypeWithLength.length))
    ) {
      tokens.push({
        type: manyCharTokenTypeWithLength.type,
      })
      munch(manyCharTokenTypeWithLength.length)
      continue
    }

    //
    // look for any numeric constants
    //
    if (isNumeric(peekChar())) {
      let length = 1
      while (isNumeric(peekChar(length))) {
        length += 1
      }

      if (isBoundaryCharacter(peekChar(length))) {
        const constant = munch(length)
        tokens.push({
          type: TOKEN_TYPE.CONSTANT,
          constant: constant,
        })
        continue
      }
    }

    //
    // look for any identifiers
    //
    if (isIdentifierStartCharacter(peekChar())) {
      let runner = 1
      while (isIdentifierInnerCharacter(peekChar(runner))) {
        runner++
      }

      const identifier = munch(runner)

      tokens.push({
        type: TOKEN_TYPE.IDENTIFIER,
        name: identifier,
      })
      continue
    }

    throw new LexError(ERROR_MESSAGES.UNRECOGNIZABLE_TOKEN_MESSAGE, {
      cause: peekChar(),
    })
  }

  return tokens
}

function tokensToString(tokens) {
  if (!tokens) {
    throw new LexError(ERROR_MESSAGES.EXPECTED_TOKENS_MESSAGE)
  }

  const strings = tokens.map((token) => {
    if (token.type === TOKEN_TYPE.IDENTIFIER) {
      return `<type: ${token.type} name: ${token.name}>`
    } else if (token.type === TOKEN_TYPE.CONSTANT) {
      return `<type: ${token.type} constant: ${token.constant}>`
    } else {
      return `<type: ${token.type}>`
    }
  })

  return strings.join(' ')
}

module.exports = {
  lex,
  tokensToString,
  TOKEN_TYPE,
  LexError,
  ERROR_MESSAGES,
}
