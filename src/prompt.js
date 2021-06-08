const readlineSync = require("readline-sync");
const {
  copyDirectory,
  deleteFile,
  readFile,
  writeFile,
  getMainProjectPath,
} = require("./fileOperations");

const { executeCommand, normalizePath } = require("./utility.js");
const PATH = getMainProjectPath();

const configJson = require("./config.json");
const ANGULARJSON_PATH = normalizePath(PATH + "/angular.json");
const PACKGEJSON_PATH = normalizePath(PATH + "/package.json");
const CYPRESSJSON_PATH = normalizePath(PATH + "/cypress.json");

const promptInstallCoverageAngular = () => {
  const reply = readlineSync.question(
    "Want to install cypress coverage into your project(y/N):"
  );
  if (reply === "y") {
    const packageJson = readFile(PACKGEJSON_PATH);
    const angularJson = readFile(ANGULARJSON_PATH);

    executeCommand(configJson["commands"]["installNgx-build-plus"]);
    executeCommand(configJson["commands"]["installIstanbul"]);
    executeCommand(configJson["commands"]["installCoverage"]);

    angularJson["projects"][packageJson["name"]]["architect"]["serve"][
      "builder"
    ] = configJson["serve"]["builder"];
    angularJson["projects"][packageJson["name"]]["architect"]["serve"][
      "options"
    ] = configJson["serve"]["options"];
    writeFile(ANGULARJSON_PATH, angularJson);

    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "coverage.webpack.js"
      ),
      normalizePath(PATH, "cypress/coverage.webpack.js")
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "cy-ts-preprocessor.js"
      ),
      normalizePath(PATH, "cypress/plugins/cy-ts-preprocessor.js")
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "plugins/index.js"
      ),
      normalizePath(PATH, "cypress/plugins/index.ts")
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "support/index.js"
      ),
      normalizePath(PATH, "cypress/support/index.ts")
    );
  }
};

const promptUninstallKarma = () => {
  const replyKarma = readlineSync.question(
    "Do you want to uninstall karma(Y/n):"
  );
  if (replyKarma.toLocaleLowerCase() === "y") {
    const angularJson = readFile(ANGULARJSON_PATH);
    const packageJson = readFile(PACKGEJSON_PATH);

    //Uninstall karma
    executeCommand(configJson["commands"]["uninstallKarma"]);
    deleteFile(`${PATH}${configJson["filePath"]["karmaConf"]}`);
    deleteFile(`${PATH}${configJson["filePath"]["test.ts"]}`);

    //remove test config in angular Json
    delete angularJson["projects"][packageJson["name"]]["architect"]["test"];
    writeFile(ANGULARJSON_PATH, angularJson);
  }
};

const promptUninstallProtractor = () => {
  const reply = readlineSync.question(
    "Do you want to uninstall protractor(Y/n):"
  );
  if (reply.toLowerCase() === "y") {
    executeCommand("npm uninstall protractor");
    deleteFile(normalizePath(PATH, "protractor.conf.js"));
  }
};

const promptInstallConcurrently = (framework) => {
  const concurrentlyReply = readlineSync.question(
    "would you like to install concurrently into your project(y/N):"
  );

  if (concurrentlyReply.toLocaleLowerCase() === "y") {
    executeCommand(configJson["commands"]["installConcurrently"]);
    const packageJson = readFile(PACKGEJSON_PATH);
    packageJson["scripts"]["cypress"] =
      'concurrently "ng serve" "cypress open"';
    if (framework === "React") {
      packageJson["scripts"]["cypress"] =
        'concurrently "npm start" "cypress open"';
    }
    writeFile(PACKGEJSON_PATH, packageJson);
  }
};

const promptInstallCoverageReact = () => {
  const reply = readlineSync.question(
    "Would you like to install cypress coverage into your project(y/N):"
  );
  if (reply === "y") {
    executeCommand("npm i @cypress/instrument-cra -D");
    executeCommand("npm i eslint-plugin-cypress  -D");
    executeCommand("npm i npm-run-all -D");
    executeCommand("npm i @cypress/code-coverage nyc istanbul-lib-coverage -D");
    const packageJson = readFile(PACKGEJSON_PATH);
    packageJson["scripts"] = configJson["reactScripts"];
    packageJson["scripts"]["cypress"] =
      'concurrently "npm start" "cypress open"';
    packageJson["eslintConfig"] = configJson["reactEslintConfig"];

    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "support/index.js"
      ),
      normalizePath(PATH, "cypress/support/index.js")
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/plugins/index.js"
      ),
      normalizePath(PATH, "cypress/plugins/index.js")
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
    cypressJson["testFiles"] = "**/*.spec.{js,ts,jsx,tsx}";
    writeFile(CYPRESSJSON_PATH, cypressJson);

    const packageJson = readFile(PACKGEJSON_PATH);
    packageJson["scripts"]["ct:open"] = "cypress open-ct";
    packageJson["scripts"]["ct:run"] = "cypress run-ct";
    writeFile(PACKGEJSON_PATH, packageJson);

    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/componentIndex.js"
      ),
      normalizePath(PATH, "cypress/plugins/index.js")
    );

    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/App.spec.js"
      ),
      normalizePath(PATH, "src/App.spec.js")
    );
  }
};

const promptInstallCoverageVue = () => {
  const reply = readlineSync.question(
    "Want to install cypress coverage into your project(y/N):"
  );

  if (reply === "y") {
    executeCommand("npm i -D babel-plugin-istanbul");
    executeCommand(
      "npm i -D @cypress/code-coverage  istanbul-lib-coverage nyc "
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "vue/babel.config.js"
      ),
      normalizePath(PATH, "babel.config.js")
    );

    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "vue/plugins/index.js"
      ),
      normalizePath(PATH, "cypress/plugins/index.js")
    );
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "support/index.js"
      ),
      normalizePath(PATH, "cypress/support/index.js")
    );
  }
};

const testCypressInstallation = (framework) => {
  if (framework === "Angular") {
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-installer"],
        "test/angular.test.js"
      ),
      normalizePath(PATH, "cypress-installer.test.js")
    );
  }
  if (framework === "React") {
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-installer"],
        "test/react.test.js"
      ),
      normalizePath(PATH, "cypress-installer.test.js")
    );
  }
  if (framework === "Vue") {
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-installer"],
        "test/vue.test.js"
      ),
      normalizePath(PATH, "cypress-installer.test.js")
    );
  }
  executeCommand("npm i -D jest");

  let packageJson = readFile(PACKGEJSON_PATH);
  packageJson["scripts"]["test:cyi"] = "jest cypress-installer.test.js";
  writeFile(PACKGEJSON_PATH, packageJson);

  executeCommand("npm run test:cyi");
  executeCommand("npm un -D jest");
  deleteFile(normalizePath(PATH, "cypress-installer.test.js"));

  packageJson = readFile(PACKGEJSON_PATH);
  delete packageJson["scripts"]["test:cyi"];
  writeFile(PACKGEJSON_PATH, packageJson);
};

const promptInstallMochaReport = () => {
  executeCommand(
    "npm i -D mocha@7.2.0 mochaawesome@6.1.1 mochaawesome-merge@4.1.0 mochaawesome-report-generator@5.1.0"
  );
};

exports.promptInstallCoverageAngular = promptInstallCoverageAngular;
exports.promptUninstallKarma = promptUninstallKarma;
exports.promptUninstallProtractor = promptUninstallProtractor;
exports.promptInstallConcurrently = promptInstallConcurrently;

exports.promptInstallCoverageReact = promptInstallCoverageReact;
exports.promptComponentTestReact = promptComponentTestReact;

exports.promptInstallCoverageVue = promptInstallCoverageVue;

exports.testCypressInstallation = testCypressInstallation;
exports.ANGULARJSON_PATH = ANGULARJSON_PATH;
exports.PACKGEJSON_PATH = PACKGEJSON_PATH;
exports.CYPRESSJSON_PATH = CYPRESSJSON_PATH;
