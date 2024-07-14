# Developer Docs

## Running the compiler
This project is an npm style node project. The primary entry point for running the software in this directory is through the npm interface. `npm start -- [...args]` is how you run the compiler and pass arguments to the compiler.

## Tests
There are two test suites for this project
- the tests in `./node-tests` are unit tests that I wrote to exercise my code
- the tests in `./book-provided-tests` are tests that the author of the book I am following created to test reader's implementations.

### Running the node tests
Simply execute `npm run test`.

### Running the book provided tests
The tests are expected to on an `x86-64` machine. If you are using a computer with apple silicon, create a new sub shell with `arch -x86_64 zsh` that is running on the simulated intel architecture. You can verify that you are running on the emulated architecture by executing `arch` which should print `i386`.

Then `cd ./book-provided-tests` and run `./test-compiler`.


