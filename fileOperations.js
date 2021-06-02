const {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rename,
  unlinkSync,
} = require("fs");
const fse = require("fs-extra");
const path = require("path");

const copyDirectory = (srcPath, destPath) => {
  try {
    fse.copySync(srcPath, destPath, { overwrite: true });
  } catch (err) {
    console.error(err);
  }
};

const createDirectory = (path) => {
  mkdirSync(path, { recursive: true }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("New directory successfully created.");
    }
  });
};

const moveDirectory = (oldPath, newPath) => {
  rename(oldPath, newPath, (err) => {
    if (err) throw err;
    console.log("Rename complete!");
  });
};

const deleteFile = (path) => {
  try {
    unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
};

const getMainProjectPath = () => {
  const fullPath = path.dirname(require.main.filename);
  const regexResp = /^(.*?)node_modules/.exec(fullPath);
  const appRoot = regexResp ? regexResp[1] : fullPath;
  return appRoot;
};

const readFile = (path) => {
  return JSON.parse(readFileSync(path));
};

const writeFile = (path, object) => {
  writeFileSync(path, JSON.stringify(object, null, 2));
};

exports.createDirectory = createDirectory;
exports.moveDirectory = moveDirectory;
exports.getMainProjectPath = getMainProjectPath;
exports.deleteFile = deleteFile;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.copyDirectory = copyDirectory;
