const {
  copyDirectory,
  createDirectory,
  readFile,
  writeFile,
  getMainProjectPath,
} = require("./fileOperations");

const { normalizePath } = require("./utility.js");

const PATH = getMainProjectPath();
const PACKGEJSON_PATH = normalizePath(PATH + "/package.json");
const configJson = require("./config.json");

const configCypressDirectory = (framework) => {
  const cypressConfig = configJson["cypressConfig"];
  copyDirectory(
    normalizePath(PATH, configJson["filePath"]["cypress-installer"], "cypress"),
    normalizePath(PATH, "/cypress")
  );

  createDirectory(normalizePath(PATH, configJson["filePath"]["cypress/test"]));
  createDirectory(
    normalizePath(PATH, configJson["filePath"]["cypress/screenshots"])
  );
  createDirectory(
    normalizePath(PATH, configJson["filePath"]["cypress/videos"])
  );

  if (framework === "React") {
    cypressConfig["baseUrl"] = "http://localhost:3000";
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "react/Hello.spec.js"
      ),
      normalizePath(PATH, "cypress/integration/examples/Hello.spec.js")
    );
  }
  if (framework === "Vue") {
    cypressConfig["baseUrl"] = "http://localhost:8080";
    copyDirectory(
      normalizePath(
        PATH,
        configJson["filePath"]["cypress-coverage"],
        "vue/Hello.spec.js"
      ),
      normalizePath(PATH, "cypress/integration/examples/Hello.spec.js")
    );
  }

  if (framework === "Angular")
    writeFile(
      normalizePath(PATH, "/cypress/tsconfig.json"),
      configJson["tsconfig"]
    );

  writeFile(normalizePath(PATH, "/cypress.json"), cypressConfig);
};

const addCypressScripts = () => {
  const packageJson = readFile(PACKGEJSON_PATH);
  packageJson["scripts"]["cy:open"] = "cypress open";
  packageJson["scripts"]["cy:run"] = "cypress run";
  writeFile(PACKGEJSON_PATH, packageJson);
};

exports.addCypressScripts = addCypressScripts;
exports.configCypressDirectory = configCypressDirectory;
