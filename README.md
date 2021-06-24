# website-testing

All the important tests that our website should contain.

## Before runnig tests

-   Testers will be needed to create a test github account in order run the SignIn tests successfully.
-   We'll be using the npm package [config](https://www.npmjs.com/package/config). This package allows us to define a set of default parameters and extend them for different deployment environments.
-   In the config folder, you'll find a `default.json` file. This file contains the structure of the config variables and you can see this to get an idea about it. You need to create a `local.json` file in the config folder itself which contains the credentials of your test account and will override the default configuration provided by `default.json`.
-   We use [puppeteer](https://pptr.dev/) and [jest](https://jestjs.io/) for testing so please familiarise yourself to these technologies if required.

## Running tests

-   Run `yarn install` to install the packages
-   Run `yarn test` to run the tests
-   If you have multiple tests and want to run just one of them use `jest <test-file-name>` command.

## Contribution

-   Before contributing your code, please add the `local.json` file to `.gitignore`.
-   After running all the tests successfully, please delete you test github account as it actually gets added to the RDS database. And we don't need spam accounts in there ;).
