[![pipeline status](https://git.generativeobjects.com/go-core/go-front-libs/badges/master/pipeline.svg)](https://git.generativeobjects.com/go-core/go-front-libs/commits/master)

[![coverage report](https://git.generativeobjects.com/go-core/go-front-libs/badges/master/coverage.svg)](https://git.generativeobjects.com/go-core/go-front-libs/commits/master)

This repository contains the libraries developped by Generative Objects for GO generated apps.

# Installation / Use in projects

No installation / compilation needed, all code is written using ES6 so it needs to be imported accordingly in your project.

## Adding to package.json

It can be referenced in your `package.json` file for installation and then imported in your project (that is the default in GO generated applications).
You can directly reference this repository using the following `package.json` entry:

```javascript
dependencies: {
    ...
    "go-front-libs": "git+ssh://git@git.generativeobjects.com:go-core/go-front-libs.git"
    ...
}
```

then running `npm install` from a command line console where your SSH Agent is _logged in_. This means the machine where you run that should already have a [SSH Key generated](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) and added to your Gitlab account.

In order to be logged in in the console, if you SSH Key has a passphrase, you'll need to run the following:

```bash
    eval `ssh-agent -s`
    ssh-add
```

## Using in project

To use any methods exported from one of the libraries in `./libs/`, you'll need to add an `import` statement at the beggining of the corresponding file, a bit like this:

```javascript
import {
    buildDataset,
    addEntitiesToDataset
} from 'go-front-libs/libs/go-dataset-builder';
```

# Tests

A set of unit test is provided. Everything is configured so that you can add tests easily.

1.  Run `npm install` in the folder to install all needed `node_modules`
2.  There are 3 test scripts available in the `package.json` file:

    a. `npm test` will run the tests once, using [mocha](https://mochajs.org/)

    b. `npm run "test-watch"` will start a temporay local web server watching for changes, and running the above command everytime one file is changed (useful for interactive testing)

    c. `npm run cover` will run the first command and generate a coverage report. A summary is visilble in the console and a full coverage report is available under the `test/coverage/lcov-report/` folder, just open the `index.html` file and browse the report to see which lines of codes (or branches) are not covered.
