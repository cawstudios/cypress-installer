const { execSync } = require("child_process");
const path = require("path");

const executeCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.log(error.stderr);
    process.exit(0);
  }
};

const normalizePath = (...args) => {
  const result = args.reduce((acc, cur) => {
    return acc + cur;
  });

  return path.normalize(result);
};

exports.executeCommand = executeCommand;
exports.normalizePath = normalizePath;
