const { execSync } = require("child_process");
const readlineSync = require("readline-sync");
const {
  promptInstallConcurrently,
  promptInstallCypressCoverage,
  promptUninstallKarma,
} = require("./prompt");

const {
  addCypressScripts,
  configCypressDirectory,
} = require("./cypressConfig.js");
const config = require("./config.json");

const FRAMEWORKS = ["Angular", "React"];

const executeCommand = (command) => {
  console.log(execSync(command).toString());
};

try {
  const reply = readlineSync.question(
    "Want to install cypress into your project(Y/n):"
  );

  if (reply === "y") {
    executeCommand(config["commands"]["installCypress"]);
    const index = readlineSync.keyInSelect(FRAMEWORKS, "Which framework?");
    if (index === 0) {
      const replyKarma = readlineSync.question("Want to uninstall karma(Y/n):");
      if (replyKarma.toLocaleLowerCase() === "y") {
        promptUninstallKarma();
        promptInstallConcurrently();
        promptInstallCypressCoverage("Angular");
      } else process.exit(0);
    } else if (index === 1) {
      console.log("\nReact\n");
      configCypressDirectory("React");
      addCypressScripts();
      promptInstallCypressCoverage("React");
    } else process.exit(0);
  } else process.exit(0);
} catch (error) {
  console.log(error);
}
