class FatalError extends Error {
  constructor(message) {
    super(message)
  }
}

function logErrorAndExit(error) {
  let isFatal = false

  if (error instanceof FatalError) {
    isFatal = true
    console.error('Fatal Error: ' + error.message)
  } else {
    console.error('Unknown Error:', error)
  }

  console.error(
    '\nStack Trace: ==========================================================================',
  )
  console.error(error.stack)
  console.error(
    '=======================================================================================',
  )
  console.error()

  if (isFatal) {
    process.exit(1)
  }
}

module.exports = {
  FatalError,
  logErrorAndExit,
}
