const {
  copyDirectory,
  createDirectory,
  readFile,
  writeFile,
  getMainProjectPath,
} = require("./fileOperations");
const path = require("path");
const PATH = getMainProjectPath();
const PACKGEJSON_PATH = path.join(PATH + "/package.json");
const configJson = require("./config.json");

const configCypressDirectory = (framework) => {
  const cypressConfig = configJson["cypressConfig"];
  copyDirectory(
    path.join(PATH, configJson["filePath"]["cypress-installer"], "cypress"),
    path.join(PATH, "/cypress")
  );

  createDirectory(path.join(PATH, configJson["filePath"]["cypress/test"]));
  createDirectory(
    path.join(PATH, configJson["filePath"]["cypress/screenshots"])
  );
  createDirectory(path.join(PATH, configJson["filePath"]["cypress/videos"]));

  if (framework === "React") cypressConfig["baseUrl"] = "http://localhost:3000";
  if (framework === "Vue") cypressConfig["baseUrl"] = "http://localhost:8080";
  if (framework === "Angular")
    if (framework === "Angular")
      writeFile(
        path.join(PATH, "/cypress/tsconfig.json"),
        configJson["tsconfig"]
      );

  writeFile(path.join(PATH, "/cypress.json"), cypressConfig);
};

const addCypressScripts = () => {
  const packageJson = readFile(PACKGEJSON_PATH);
  packageJson["scripts"]["cy:open"] = "cypress open";
  packageJson["scripts"]["cy:run"] = "cypress run";
  packageJson["scripts"]["ct:open"] = "cypress open-ct";
  packageJson["scripts"]["ct:run"] = "cypress run-ct";
  writeFile(PACKGEJSON_PATH, packageJson);
};

exports.addCypressScripts = addCypressScripts;
exports.configCypressDirectory = configCypressDirectory;
