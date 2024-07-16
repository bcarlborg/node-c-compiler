class FatalError extends Error {
  constructor(message) {
    super(message)
  }
}

function logError(error) {
  let isFatal = false

  if (error instanceof FatalError) {
    isFatal = true
    console.error('Fatal Error: ' + error.message)
  } else {
    console.error('Unknown Error:', error)
  }

  console.log(
    '\nStack Trace: ==========================================================================',
  )
  console.error(error.stack)
  console.log(
    '=======================================================================================',
  )

  if (isFatal) {
    process.exit(1)
  }
}

module.exports = {
  FatalError,
  logError,
}
