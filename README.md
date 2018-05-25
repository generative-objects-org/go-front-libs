This repository contains the libraries developped by Generative Objects for GO generated apps.

# Installation

No installation / compilation needed, all code is written using ES6 no it needs to be imported accordingly in your project. 
It can be referenced in your `package.json` file for installation and then imported in your project (that is the default in GO generated applications).

# Tests

A set of unit test is provided. Everything is configured so that you can add tests easily.

1. Run `npm install` in the folder to install all needed `node_modules`
2. There are 3 test scripts available in the `package.json` file:

    a. `npm test` will run the tests once, using [mocha](https://mochajs.org/)

    b. `npm run "test-watch"` will start a temporay local web server watching for changes, and running the above command everytime one file is changed (useful for interactive testing)
    
    c. `npm run cover` will run the first command and generate a coverage report. A summary is visilble in the console and a full coverage report is available under the `test/coverage/lcov-report/` folder, just open the `index.html` file and browse the report to see which lines of codes (or branches) are not covered.