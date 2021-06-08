const fs = require("fs");
const {
  getMainProjectPath,
  readFile,
} = require("./node_modules/cypress-installer/src/fileOperations");
const PATH = getMainProjectPath();
const {
  normalizePath,
} = require("./node_modules/cypress-installer/src/utility");

describe("Testing project", function () {
  it("verify whether the cypress directory is created or not", function () {
    fs.readdirSync(normalizePath(PATH, "/cypress"));
    console.log(PATH);
  });
  it("verify whether the cypress json is created or not", function () {
    fs.readFileSync(normalizePath(PATH, "/cypress.json"));
  });

  it("verify the sample test file created in integration folder", () => {
    fs.readFileSync(
      normalizePath(PATH, "/cypress/integration/examples/Hello.spec.js")
    );
  });

  it("verify whether the baseaddress in cypress json is correct", function () {
    const cypressJson = readFile(normalizePath(PATH, "/cypress.json"));
    expect(cypressJson["baseUrl"]).toBe("http://localhost:3000");
  });

  it("verify whether the package json has test scripts", function () {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(packageJson["scripts"]["cy:open"]).toBe("cypress open");
    expect(packageJson["scripts"]["cy:run"]).toBe("cypress run");
  });

  it("verify whether the concurrently is installed", function () {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(packageJson["scripts"]["cypress"]).toBe(
      'concurrently "npm start" "cypress open"'
    );
    expect(packageJson["devDependencies"]["concurrently"]).toBeDefined();
  });

  it("verify whether cypress coverage dependencies installed", () => {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(
      packageJson["devDependencies"]["@cypress/code-coverage"]
    ).toBeDefined();
    expect(
      packageJson["devDependencies"]["istanbul-lib-coverage"]
    ).toBeDefined();
    expect(
      packageJson["devDependencies"]["@cypress/webpack-dev-server"]
    ).toBeDefined();
    expect(packageJson["devDependencies"]["@cypress/react"]).toBeDefined();
    expect(packageJson["devDependencies"]["nyc"]).toBeDefined();
  });

  it("verify whether the package json has component test scripts", function () {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(packageJson["scripts"]["ct:open"]).toBe("cypress open-ct");
    expect(packageJson["scripts"]["ct:run"]).toBe("cypress run-ct");
  });

  it("verify the sample component test file created in src folder", () => {
    fs.readFileSync(normalizePath(PATH, "/src/App.spec.js"));
  });
});
