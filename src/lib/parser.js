const { FatalError } = require('./errors')
const { TOKEN_TYPE } = require('./lexer')

class ParseError extends Error {
  constructor(message) {
    super('Parse Error: ' + message)
  }
}

const NODE_TYPE = {
  PROGRAM: 'program',
  FUNCTION_DECLARATION: 'function_declaration',
  RETURN_STATEMENT: 'return_statement',
  CONSTANT_EXPRESSION: 'constant_expression',
}

const ERROR_MESSAGES = {
  FUNCTION_EXPECTED_RETURN_TYPE:
    'Cannot parse function -- expected valid return type',
  FUNCTION_EXPECTED_NAME_IDENTIFIER:
    'Parse error: cannot parse function, expected function name identifier token',
  FUNCTION_EXPECTED_OPEN_PAREN:
    'cannot parse function, expected ( after function name',
  FUNCTION_EXPECTED_ARGUMENTS: 'cannot parse function, expected arguments',
  FUNCTION_EXPECTED_CLOSE_PAREN:
    'cannot parse function, expected close paren after args',
  FUNCTION_EXPECTED_OPEN_BRACE:
    'cannot parse function, expected open brace to start function body',
  FUNCTION_EXPECTED_CLOSE_BRACE:
    'cannot parse function, closing brace after function body',
  RETURN_STATEMENT_EXPECTED_RETURN:
    'cannot parse return statement, expected return keyword',
  RETURN_STATEMENT_EXPECTED_SEMICOLON:
    'cannot parse return statement, expected semicolon',
  CONSTANT_EXPECTED_CONSTANT:
    'cannot parse constant expression, expected constant',
}

function parse(tokens) {
  let current_token_index = 0

  /**
   * Returns the current token plus the offset n if provided
   */
  function peekToken(n) {
    if (!n) {
      return tokens[current_token_index]
    }

    if (current_token_index + n < tokens.length) {
      return tokens[current_token_index + n]
    }

    return tokens[tokens.length - 1]
  }

  /**
   * Expect a token type at offset n from current token.
   * Returns true if that token type is at the expected location
   */
  function expectTokenType(tokenType, n) {
    const peekedToken = peekToken(n)
    return peekedToken.type === tokenType
  }

  /**
   * Returns an array of munch tokens.
   * If n is not provided, the array is 1 munched token
   * If n is provided, the array is the current token + the n next tokens
   */
  function munchTokens(numberOfTokens) {
    const numberOfTokensToMunch = numberOfTokens || 1

    // c = 0, n = 1, end = 1
    // c = 1, n = 3, end = 4
    let end = current_token_index + numberOfTokensToMunch

    if (end > tokens.length) {
      end = tokens.length
    }

    const munchedTokens = tokens.slice(current_token_index, end)

    current_token_index += munchedTokens.length

    return munchedTokens
  }

  /**
   * returns a program node object:
   * {
   *  type: NODE_TYPE.program
   *  function?: FunctionNode
   * }
   *
   * Uses the grammar rule
   * <program> ::= <function>
   */
  function parseProgram() {
    if (tokens.length === 0) {
      return {
        type: NODE_TYPE.PROGRAM,
      }
    }

    const parsedFunction = parseFunction()
    if (parsedFunction) {
      return {
        type: NODE_TYPE.PROGRAM,
        functionNode: parsedFunction,
      }
    }

    return {
      type: NODE_TYPE.PROGRAM,
    }
  }

  /**
   * returns a function node object:
   * {
   *  type: NODE_TYPE.FUNCTION_DECLARATION
   *  returnType: { type: TOKEN_TYPE.INT }
   *  functionName: { type: TOKEN_TYPE.IDENTIFIER, name: string }
   *  args: { type: TOKEN_TYPE.VOID }
   *  bodyStatement: { type: NODE_TYPE.STATEMENT }
   * }
   *
   * Uses the grammar rule
   * <function> ::= "int" <identifier> "(" "void" ")" "{" <statement> "}"
   */
  function parseFunction() {
    //
    // Get the return type
    //

    if (!expectTokenType(TOKEN_TYPE.INT)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_RETURN_TYPE)
    }
    const returnTypeToken = munchTokens(1)[0]

    //
    // Get the function name
    //

    if (!expectTokenType(TOKEN_TYPE.IDENTIFIER)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_NAME_IDENTIFIER)
    }
    const functionNameToken = munchTokens(1)[0]

    //
    // Get the args open paren
    //

    if (!expectTokenType(TOKEN_TYPE.OPEN_PAREN)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_OPEN_PAREN)
    }
    munchTokens(1)

    //
    // Get the args tokens
    //

    if (!expectTokenType(TOKEN_TYPE.VOID)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_ARGUMENTS)
    }

    const argsToken = munchTokens(1)[0]

    //
    // Get the close args paren
    //

    if (!expectTokenType(TOKEN_TYPE.CLOSE_PAREN)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_CLOSE_PAREN)
    }
    munchTokens(1)

    //
    // Get the body open brace
    //

    if (!expectTokenType(TOKEN_TYPE.OPEN_BRACE)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_OPEN_BRACE)
    }
    munchTokens(1)

    //
    // Get the function body statement
    //

    // parseStatement may throw, we do not catch because we would
    // just throw it anyways
    const bodyStatementNode = parseStatement()

    //
    // Get the body close brace
    //

    if (!expectTokenType(TOKEN_TYPE.CLOSE_BRACE)) {
      throw new ParseError(ERROR_MESSAGES.FUNCTION_EXPECTED_CLOSE_BRACE)
    }
    munchTokens(1)

    return {
      type: NODE_TYPE.FUNCTION_DECLARATION,
      returnType: returnTypeToken,
      functionName: functionNameToken,
      args: argsToken,
      bodyStatement: bodyStatementNode,
    }
  }

  /**
   * returns a statement node object.
   */
  function parseStatement() {
    return parseReturnStatement()
  }

  /**
   * returns a RETURN_STATEMENT ast node
   * {
   *  type: NODE_TYPE.RETURN_STATEMENT,
   *  expression: EXPRESSION_NODE
   * }
   */
  function parseReturnStatement() {
    //
    // Get the return statement
    //

    if (!expectTokenType(TOKEN_TYPE.RETURN)) {
      throw new ParseError(ERROR_MESSAGES.RETURN_STATEMENT_EXPECTED_RETURN)
    }
    munchTokens(1)

    //
    // parse the expression
    //

    const expression = parseExpression()

    //
    // Get the semicolon
    //

    if (!expectTokenType(TOKEN_TYPE.SEMICOLON)) {
      throw new ParseError(ERROR_MESSAGES.RETURN_STATEMENT_EXPECTED_SEMICOLON)
    }
    munchTokens(1)

    return {
      type: NODE_TYPE.RETURN_STATEMENT,
      expression,
    }
  }

  /**
   * returns an expression statement ast node
   */
  function parseExpression() {
    return parseConstantExpression()
  }

  /**
   * returns a constant expression statement ast node
   * {
   *  type: NODE_TYPE.CONSTANT_EXPRESSION,
   *  constant: EXPRESSION_NODE
   * }
   */
  function parseConstantExpression() {
    //
    // Get the number constant
    //

    if (!expectTokenType(TOKEN_TYPE.CONSTANT)) {
      throw new ParseError(ERROR_MESSAGES.CONSTANT_EXPECTED_CONSTANT)
    }

    const constantToken = munchTokens(1)[0]

    return {
      type: NODE_TYPE.CONSTANT_EXPRESSION,
      constant: constantToken,
    }
  }

  return parseProgram()
}

function astToString(ast) {
  function getWhitespaceForIndentLevel(indentLevel) {
    let indentWhiteSpace = ''
    for (let i = 0; i < indentLevel; i++) {
      indentWhiteSpace += '  '
    }
    return indentWhiteSpace
  }

  function programNodeToString(node, indentLevel) {
    if (node.type !== NODE_TYPE.PROGRAM) {
      throw new FatalError(
        `Cannot print PROGRAM ast node: unexpected type ${ast.type}`,
      )
    }

    const indent = getWhitespaceForIndentLevel(indentLevel)

    let str = ''
    str += indent + 'Program(' + '\n'
    str += printFunctionDeclarationNode(node.functionNode, indentLevel + 1)
    str += indent + ')' + '\n'

    return str
  }

  function printFunctionDeclarationNode(node, indentLevel) {
    if (node.type !== NODE_TYPE.FUNCTION_DECLARATION) {
      throw new FatalError(
        `Cannot print FUNCTION_DECLARATION ast node: unexpected type ${ast.type}`,
      )
    }

    const indent = getWhitespaceForIndentLevel(indentLevel)
    const indentInner = getWhitespaceForIndentLevel(indentLevel + 1)

    let str = ''
    str += indent + 'FunctionDeclaration(' + '\n'
    str += indentInner + 'returnType: ' + node.returnType.type + '\n'
    str += indentInner + 'functionName: ' + node.functionName.name + '\n'
    str += indentInner + 'args: ' + node.args.type + '\n'
    str += statementToString(node.bodyStatement, indentLevel + 1)
    str += indent + ')' + '\n'

    return str
  }

  function statementToString(node, indentLevel) {
    if (node.type === NODE_TYPE.RETURN_STATEMENT) {
      return returnStatementToString(node, indentLevel)
    }

    throw new FatalError(
      `Cannot print statement ast node: unexpected type ${ast.type}`,
    )
  }

  function returnStatementToString(node, indentLevel) {
    if (node.type !== NODE_TYPE.RETURN_STATEMENT) {
      throw new FatalError(
        `Cannot print RETURN_STATEMENT ast node: unexpected type ${ast.type}`,
      )
    }

    const indent = getWhitespaceForIndentLevel(indentLevel)

    let str = ''
    str += indent + 'ReturnStatement(' + '\n'
    str += expressionToString(node.expression, indentLevel + 1)
    str += indent + ')' + '\n'

    return str
  }

  function expressionToString(node, indentLevel) {
    if (node.type === NODE_TYPE.CONSTANT_EXPRESSION) {
      return constantExpressionToString(node, indentLevel)
    }

    throw new FatalError(
      `Cannot print expression ast node: unexpected type ${ast.type}`,
    )
  }

  function constantExpressionToString(node, indentLevel) {
    if (node.type !== NODE_TYPE.CONSTANT_EXPRESSION) {
      throw new FatalError(
        `Cannot print CONSTANT_EXPRESSION ast node: unexpected type ${ast.type}`,
      )
    }

    const indent = getWhitespaceForIndentLevel(indentLevel)

    let str = ''
    str += indent + 'Constant(' + node.constant + ')' + '\n'
    return str
  }

  return programNodeToString(ast, 0)
}

module.exports = {
  parse,
  astToString,
  NODE_TYPE,
  ParseError,
  ERROR_MESSAGES,
}
