const { execSync } = require("child_process");
const readlineSync = require("readline-sync");
const {
  copyDirectory,
  deleteFile,
  readFile,
  writeFile,
  getMainProjectPath,
} = require("./fileOperations");
const {
  addCypressScripts,
  configCypressDirectory,
} = require("./cypressConfig.js");
const configJson = require("./config.json");

const PATH = getMainProjectPath();
const ANGULARJSON_PATH = `${PATH}\\angular.json`;
const PACKGEJSON_PATH = `${PATH}\\package.json`;
const CYPRESSJSON_PATH = `${PATH}\\cypress.json`;

const executeCommand = (command) => {
  console.log(execSync(command).toString());
};

const promptCoverageReact = () => {
  const reply = readlineSync.question(
    "Would you like to install cypress coverage into your project(y/N):"
  );
  if (reply === "y") {
    const packageJson = readFile(PACKGEJSON_PATH);
    executeCommand("npm i @cypress/instrument-cra -D");
    executeCommand("npm i npm-run-all -D");
    executeCommand("npm i @cypress/code-coverage nyc istanbul-lib-coverage -D");
    packageJson["scripts"] = configJson["reactScripts"];
    packageJson["eslintConfig"] = configJson["reactEslintConfig"];

    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}support\\index.js`,
      `${PATH}cypress\\support\\index.js`
    );
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}react\\plugins\\index.js`,
      `${PATH}cypress\\plugins\\index.js`
    );
    writeFile(PACKGEJSON_PATH, packageJson);
  }
};

const promptComponentTestReact = () => {
  const reply = readlineSync.question(
    "Would you like to install component testing for your react project(y/N):"
  );
  if (reply === "y") {
    executeCommand("npm i @cypress/react @cypress/webpack-dev-server -D");
    const cypressJson = readFile(CYPRESSJSON_PATH);
    cypressJson["componentFolder"] = "src";
    cypressJson["testFiles"] = "**/*.test.{js,ts,jsx,tsx}";
    writeFile(CYPRESSJSON_PATH, cypressJson);
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}react\\componentIndex.js`,
      `${PATH}cypress\\plugins\\index.js`
    );
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}react\\App.test.js`,
      `${PATH}src\\App.test.js`
    );
  }
};

const promptUninstallKarma = () => {
  const angularJson = readFile(ANGULARJSON_PATH);
  const packageJson = readFile(PACKGEJSON_PATH);

  //Uninstall karma
  executeCommand(configJson["commands"]["uninstallKarma"]);
  deleteFile(`${PATH}${configJson["filePath"]["karmaConf"]}`);
  deleteFile(`${PATH}${configJson["filePath"]["test.ts"]}`);

  //remove test config in angular Json
  delete angularJson["projects"][packageJson["name"]]["architect"]["test"];
  writeFile(ANGULARJSON_PATH, angularJson);

  //create cypress directory
  configCypressDirectory("Angular");
};

const promptInstallConcurrently = () => {
  const concurrentlyReply = readlineSync.question(
    "would you like to install concurrently into your project(y/N):"
  );

  if (concurrentlyReply.toLocaleLowerCase() === "y") {
    const packageJson = readFile(PACKGEJSON_PATH);
    executeCommand(configJson["commands"]["installConcurrently"]);
    packageJson["scripts"]["cypress"] =
      'concurrently "ng serve" "cypress open"';
    writeFile(PACKGEJSON_PATH, packageJson);
    addCypressScripts();
  }
};

const promptInstallCypressCoverage = () => {
  const reply = readlineSync.question(
    "Want to install cypress coverage into your project(y/N):"
  );
  if (reply === "y") {
    executeCommand(configJson["commands"]["installNgx-build-plus"]);
    executeCommand(configJson["commands"]["installIstanbul"]);
    executeCommand(configJson["commands"]["installCoverage"]);

    const packageJson = readFile(PACKGEJSON_PATH);
    const angularJson = readFile(ANGULARJSON_PATH);
    angularJson["projects"][packageJson["name"]]["architect"]["serve"][
      "builder"
    ] = configJson["serve"]["builder"];
    angularJson["projects"][packageJson["name"]]["architect"]["serve"][
      "options"
    ] = configJson["serve"]["options"];
    writeFile(ANGULARJSON_PATH, angularJson);

    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-installer"]}coverage.webpack.js`,
      `${PATH}cypress\\coverage.webpack.js`
    );
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-installer"]}cy-ts-preprocessor.js`,
      `${PATH}cypress\\plugins\\cy-ts-preprocessor.js`
    );
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}plugins\\index.js`,
      `${PATH}cypress\\plugins\\index.js`
    );
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-coverage"]}support\\index.js`,
      `${PATH}cypress\\support\\index.js`
    );
  }
};

exports.promptInstallConcurrently = promptInstallConcurrently;
exports.promptInstallCypressCoverage = promptInstallCypressCoverage;
exports.promptUninstallKarma = promptUninstallKarma;
exports.promptCoverageReact = promptCoverageReact;
exports.promptComponentTestReact = promptComponentTestReact;
exports.ANGULARJSON_PATH = ANGULARJSON_PATH;
exports.PACKGEJSON_PATH = PACKGEJSON_PATH;
