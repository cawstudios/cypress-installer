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
  it("verify whether the package json has test scripts", function () {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(packageJson["scripts"]["cy:open"]).toBe("cypress open");
    expect(packageJson["scripts"]["cy:run"]).toBe("cypress run");
    expect(packageJson["scripts"]["cy:run"]).toBe("cypress run");
  });
  it("verify whether the concurrently is installed", function () {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));
    expect(packageJson["scripts"]["cypress"]).toBe(
      'concurrently "ng serve" "cypress open"'
    );
    expect(packageJson["devDependencies"]["concurrently"]).toBeDefined();
  });
  it("verify whether the tsconfig is created into the  cypress folder", function () {
    fs.readFileSync(normalizePath(PATH, "/cypress/tsconfig.json"));
  });
  it("verify whether the baseaddress in cypress json is correct", function () {
    const cypressJson = readFile(normalizePath(PATH, "/cypress.json"));
    expect(cypressJson["baseUrl"]).toBe("http://localhost:4200");
  });
  it("verify whether cypress coverage dependencies installed", () => {
    const packageJson = readFile(normalizePath(PATH, "/package.json"));

    expect(
      packageJson["devDependencies"]["istanbul-instrumenter-loader"]
    ).toBeDefined();
    expect(packageJson["devDependencies"]["ngx-build-plus"]).toBeDefined();
    expect(
      packageJson["devDependencies"]["@cypress/code-coverage"]
    ).toBeDefined();
    expect(
      packageJson["devDependencies"]["@cypress/webpack-preprocessor"]
    ).toBeDefined();
  });

  it("verify necessary files for code coverage is created", () => {
    fs.readFileSync(normalizePath(PATH, "/cypress/coverage.webpack.js"));
    fs.readFileSync(
      normalizePath(PATH, "/cypress/plugins/cy-ts-preprocessor.js")
    );
  });

  it("verify the sample test file created in integration folder", () => {
    fs.readFileSync(
      normalizePath(PATH, "/cypress/integration/examples/Hello.spec.js")
    );
  });
});
