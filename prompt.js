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
const fs = require("fs");
const path = require("path");
const configJson = require("./config.json");

const PATH = getMainProjectPath();
const ANGULARJSON_PATH = path.join(PATH + "/angular.json");
const PACKGEJSON_PATH = path.join(PATH + "/package.json");
const CYPRESSJSON_PATH = path.join(PATH + "/cypress.json");

const executeCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(error.stderr);
    process.exit(0);
  }
};

const promptInstallEslint = (index) => {
  const reply = readlineSync.question(
    "Would you like to install eslint and prettier for cypress(y/N):"
  );
  if (reply === "y") {
    if (index === 0) {
      executeCommand("npm i eslint -D");
      executeCommand(
        "npm i @typescript-eslint/eslint-plugin eslint-plugin-prettier eslint-plugin-angular -D"
      );
      executeCommand(
        "npm i prettier prettier-eslint eslint-config-prettier -D"
      );
      executeCommand("npm install eslint-plugin-cypress --save-dev");
      writeFile(
        path.join(PATH, "/.eslintrc.json"),
        configJson["eslintConfigAngular"]
      );
      fs.writeFileSync(
        path.join(PATH, "/.eslintignore"),
        "package.json\npackage-lock.json\ndist"
      );
      const packageJson = readFile(PACKGEJSON_PATH);
      packageJson["scripts"]["lint"] =
        "tsc --noEmit && eslint . --ext js,ts,json --quiet --fix";
      writeFile(PACKGEJSON_PATH, packageJson);
      writeFile(path.join(PATH, "/.prettierrc.json"), {
        singleQuote: true,
        trailingComma: "none",
        endOfLine: "auto",
      });
    } else if (index === 1) {
      executeCommand("npm install eslint --save-dev");
      executeCommand(
        "npm install eslint-config-prettier eslint-plugin-prettier prettier --save-dev"
      );
      writeFile(
        path.join(PATH, "/.eslintrc.json"),
        configJson["eslintConfigReact"]
      );
    }
  }
};

const promptCoverageReact = () => {
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
    packageJson["eslintConfig"] = configJson["reactEslintConfig"];

    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "support/index.js"
      ),
      path.join(PATH, "cypress/support/index.js")
    );
    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/plugins/index.js"
      ),
      path.join(PATH, "cypress/plugins/index.js")
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

    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/componentIndex.js"
      ),
      path.join(PATH, "cypress/plugins/index.js")
    );

    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/App.spec.js"
      ),
      path.join(PATH, "src/App.spec.js")
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

const promptInstallConcurrently = (framework) => {
  const concurrentlyReply = readlineSync.question(
    "would you like to install concurrently into your project(y/N):"
  );

  if (concurrentlyReply.toLocaleLowerCase() === "y") {
    const packageJson = readFile(PACKGEJSON_PATH);
    executeCommand(configJson["commands"]["installConcurrently"]);
    packageJson["scripts"]["cypress"] =
      'concurrently "ng serve" "cypress open"';
    if (framework === "React") {
      packageJson["scripts"]["cypress"] =
        'concurrently "npm start" "cypress open"';
    }
    writeFile(PACKGEJSON_PATH, packageJson);
    addCypressScripts();
  }
};

const promptUninstallProtractor = () => {
  const reply = readlineSync.question(
    "Do you want to uninstall protractor(Y/n):"
  );
  if (reply.toLowerCase() === "y") {
    executeCommand("npm uninstall protractor");
    deleteFile(path.join(PATH, "protractor.conf.js"));
  }
};

const promptInstallCypressCoverage = () => {
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
      path.join(
        PATH,
        configJson["filePath"]["cypress-installer"],
        "src/coverage.webpack.js"
      ),
      path.join(PATH, "cypress/coverage.webpack.js")
    );
    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-installer"],
        "src/cy-ts-preprocessor.js"
      ),
      path.join(PATH, "cypress/plugins/cy-ts-preprocessor.js")
    );
    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "plugins/index.js"
      ),
      path.join(PATH, "cypress/plugins/index.ts")
    );
    copyDirectory(
      path.join(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "support/index.js"
      ),
      path.join(PATH, "cypress/support/index.ts")
    );
  }
};

const promptInstallCoverageVue = () => {
  const reply = readlineSync.question(
    "Want to install cypress coverage into your project(y/N):"
  );

  if (reply === "y") {
    // executeCommand("npm i -D coveralls");
    executeCommand("npm i -D babel-plugin-istanbul");
    executeCommand(
      "npm i -D @cypress/code-coverage  istanbul-lib-coverage nyc "
    );
    copyDirectory(
      path.join(PATH, "cypress-coverage/vue/babel.config.js"),
      path.join(PATH, "babel.config.js")
    );
    copyDirectory(
      path.join(PATH, "cypress-coverage/vue/Hello.spec.js"),
      path.join(PATH, "cypress/integration/examples/Hello.spec.js")
    );
  }
};

exports.promptInstallConcurrently = promptInstallConcurrently;
exports.promptInstallCypressCoverage = promptInstallCypressCoverage;
exports.promptUninstallKarma = promptUninstallKarma;
exports.promptCoverageReact = promptCoverageReact;
exports.promptComponentTestReact = promptComponentTestReact;
exports.promptUninstallProtractor = promptUninstallProtractor;
exports.promptInstallEslint = promptInstallEslint;
exports.promptInstallCoverageVue = promptInstallCoverageVue;
exports.ANGULARJSON_PATH = ANGULARJSON_PATH;
exports.PACKGEJSON_PATH = PACKGEJSON_PATH;
