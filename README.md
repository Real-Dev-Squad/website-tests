# website-testing

All the important tests that our website should contain.

## Before runnig tests

-   Testers will be needed to create a test github account in order run the tests successfully.
-   In the config folder, create a `default.json` file and store the username and password of your test github account in there. For more information about `config` read about it [here](https://www.npmjs.com/package/config).
-   We use [puppeteer](https://pptr.dev/) and [jest](https://jestjs.io/) for testing so please familiarise yourself to these technologies if required.

## Running tests

-   Run `yarn install` to install the packages
-   Run `yarn test` to run the tests

## Contribution

-   Before contributing your code, please add the `default.json` file to `.gitignore`.
-   After running all the tests successfully, please delete you test github account as it actually gets added to the RDS database. And we don't need spam accounts in there ;).
