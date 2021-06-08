const { getMainProjectPath } = require("../src/fileOperations");
const {
  ANGULARJSON_PATH,
  PACKGEJSON_PATH,
  CYPRESSJSON_PATH,
} = require("../src/prompt");

describe("Testing project", function () {
  it("verify whether the path is valid or not", function () {
    const projectPath = getMainProjectPath();
    expect(projectPath).toBe(
      "/home/syed/Documents/caw studios/cypress-installer/test"
    );
  });
  it("verify whether the angular json path is valid or not", function () {
    expect(ANGULARJSON_PATH).toBe(
      "/home/syed/Documents/caw studios/cypress-installer/test/angular.json"
    );
  });
  it("verify whether the package json path is valid or not", function () {
    expect(PACKGEJSON_PATH).toBe(
      "/home/syed/Documents/caw studios/cypress-installer/test/package.json"
    );
  });
  it("verify whether the cypress json path is valid or not", function () {
    expect(CYPRESSJSON_PATH).toBe(
      "/home/syed/Documents/caw studios/cypress-installer/test/cypress.json"
    );
  });
});
