const { execSync } = require("child_process");
const readlineSync = require("readline-sync");
const {
  promptInstallConcurrently,
  promptInstallCypressCoverage,
  promptUninstallKarma,
  promptCoverageReact,
  promptComponentTestReact,
  promptUninstallProtractor,
  promptInstallCoverageVue,
} = require("./prompt");

const {
  addCypressScripts,
  configCypressDirectory,
} = require("./cypressConfig.js");
const config = require("./config.json");

const FRAMEWORKS = ["Angular", "React", "Vue"];
const executeCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(error.stderr);
    process.exit(0);
  }
};

try {
  const reply = readlineSync.question(
    "would you like to install cypress into your project(Y/n):"
  );

  if (reply === "y") {
    executeCommand(config["commands"]["installCypress"]);
    const index = readlineSync.keyInSelect(FRAMEWORKS, "Which framework?");
    if (index === 0) {
      const replyKarma = readlineSync.question(
        "Do you want to uninstall karma(Y/n):"
      );
      if (replyKarma.toLocaleLowerCase() === "y") {
        promptUninstallKarma();
        promptUninstallProtractor();
        promptInstallConcurrently();
        promptInstallCypressCoverage();
      } else process.exit(0);
    } else if (index === 1) {
      configCypressDirectory("React");
      addCypressScripts();
      promptInstallConcurrently("React");
      promptCoverageReact();
      promptComponentTestReact();
    } else if (index === 2) {
      configCypressDirectory("Vue");
      addCypressScripts();
      promptInstallCoverageVue();
    } else process.exit(0);
  } else process.exit(0);
} catch (error) {
  console.log(error);
}
