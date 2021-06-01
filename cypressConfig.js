const {
  copyDirectory,
  createDirectory,
  readFile,
  writeFile,
  getMainProjectPath,
} = require("./fileOperations");

const PATH = getMainProjectPath();
const PACKGEJSON_PATH = `${PATH}\\package.json`;
const configJson = require("./config.json");

const configCypressDirectory = (framework) => {
  const cypressConfig = configJson["cypressConfig"];
  copyDirectory(
    `${PATH}${configJson["filePath"]["cypress-installer"]}cypress`,
    `${PATH}\\cypress`
  );
  createDirectory(`${PATH}${configJson["filePath"]["cypress/test"]}`);
  createDirectory(`${PATH}${configJson["filePath"]["cypress/screenshots"]}`);
  createDirectory(`${PATH}${configJson["filePath"]["cypress/videos"]}`);

  if (framework === "React") cypressConfig["baseUrl"] = "http://localhost:3000";
  if (framework === "Angular") {
    copyDirectory(
      `${PATH}${configJson["filePath"]["cypress-installer"]}tsconfig.json`,
      `${PATH}${configJson["filePath"]["cypress/tsconfig"]}`
    );
  }

  writeFile(`${PATH}\\cypress.json`, cypressConfig);
};

const addCypressScripts = () => {
  const packageJson = readFile(PACKGEJSON_PATH);
  packageJson["scripts"]["cy:open"] = "cypress open";
  packageJson["scripts"]["cy:run"] = "cypress run";
  writeFile(PACKGEJSON_PATH, packageJson);
};

exports.addCypressScripts = addCypressScripts;
exports.configCypressDirectory = configCypressDirectory;
