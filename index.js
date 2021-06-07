const readlineSync = require("readline-sync");
const {
  promptInstallCoverageAngular,
  promptUninstallKarma,
  promptUninstallProtractor,
  promptInstallConcurrently,
  promptInstallCoverageReact,
  promptComponentTestReact,
  promptInstallCoverageVue,
} = require("./src/prompt");

const { executeCommand } = require("./src/utility.js");

const {
  addCypressScripts,
  configCypressDirectory,
} = require("./src/cypressConfig.js");
const config = require("./src/config.json");

const FRAMEWORKS = ["Angular", "React", "Vue"];

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
        promptInstallCoverageAngular();
      } else process.exit(0);
    } else if (index === 1) {
      configCypressDirectory("React");
      addCypressScripts();
      promptInstallConcurrently("React");
      promptInstallCoverageReact();
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
