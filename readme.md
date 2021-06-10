#  Cypress-installer

Cypress-installer is a command line tool that installs Cypress and other dependencies for your front-end framework (Angular, React and vue js 3).

## Installation

Use the package manager [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) to install cypress-installer.

```bash
npm i -D cypress-installer
```

## Usage

```bash
npx cypress-installer
```
### This command line tool will:

   1. Prompts to install **cypress** ,its dependencies and add necessary files for cypress.
   2. Prompts to uninstall **protractor (Angular)**.
   3. Prompts to install [concurrently](https://www.npmjs.com/package/concurrently).
   4. Prompts to install **component testing (React)**.
   5. Prompts to install [code coverage](https://docs.cypress.io/guides/tooling/code-coverage).
   6. Prompts to install **Mocha Report**.

## Scripts
1. Opens Cypress test runner ```npm run cy:open```
2. Executes tests in headless mode ```npm run cy:run```
3. Executes component tests in headless mode ```npm run ct:run```
4. Opens Cypress test runner for Component test ```npm run ct:open```
5. To generate a HTML report after you run the test. Run ``` npm run generate:html:report ```
5. To remove mocha HTML report . Run ``` npm run remove-reports ```



## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)