/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:41:31
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const log = require('single-line-log').stdout;

function resolveRootPath (str) {
  return path.resolve(__dirname, `../${str}`);
}
function resolveRelativePath (dirname, str) {
  return path.resolve(dirname, `./${str}`);
}

function upcaseFirstLetter (str) {
  if (typeof str !== 'string' || !str) return '';
  return str[0].toUpperCase() + str.substr(1);
}

function writeJsonIntoFile (filePath, pkg) {
  fs.writeFileSync(transfromFilePath(filePath), JSON.stringify(pkg, null, 4), 'utf8');
}

function writeStringIntoFile (filePath, str) {
  fs.writeFileSync(transfromFilePath(filePath), str, 'utf8');
}

function copyFile (src, dest) {
  fs.copyFileSync(transfromFilePath(src), transfromFilePath(dest));
}

function transfromFilePath (filePath) {
  if (filePath[0] === '@') {
    return resolveRootPath(filePath.substr(1));
  }
  return filePath;
}

function mkdirDir (filePath) {
  filePath = transfromFilePath(filePath);
  if (!fs.existsSync(filePath)) {
    console.log('mkdirSync', filePath);
    fs.mkdirSync(filePath);
  }
}

function clearDirectory (dirPath) {
  dirPath = transfromFilePath(dirPath);
  if (!fs.existsSync(dirPath)) return;
  clearDirectoryBase(dirPath);
}

function clearDirectoryBase (dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      clearDirectoryBase(filePath);
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
};

function buildPackageJson (extract = {}) {
  const pkg = require(resolveRootPath('package.json'));

  const attrs = [
    'name', 'version', 'description', 'main', 'unpkg', 'jsdelivr', 'typings',
    'repository', 'keywords', 'author', 'license', 'bugs', 'homepage',
    'dependencies'
  ];

  const npmPkg = {};

  attrs.forEach(key => {
    npmPkg[key] = pkg[key] || '';
  });

  for (const key in extract) {
    npmPkg[key] = extract[key];
  }

  mkdirDir('@npm');
  writeJsonIntoFile('@npm/package.json', npmPkg);
}

async function exec (cmd) {
  return new Promise((resolve) => {
    if (cmd instanceof Array) {
      cmd = cmd.join(' ');
    }
    childProcess.exec(cmd, (error, stdout, stderr) => {
      console.log(stdout, stderr);
      if (error) {
        resolve({success: false, stdout, stderr});
      } else {
        resolve({
          success: true,
          stdout,
          stderr,
        });
      }
    }).stdout.on('data', data => {
      if (typeof data === 'string' && data.indexOf('sl:') === 0) {
        log(data.replace('sl:', ''));
      } else {
        console.log(data);
      }
    });
  });
}
function readFile (file) {
  return fs.readFileSync(transfromFilePath(file), 'utf8'); ;
}
function writeFile (file, txt) {
  fs.writeFileSync(transfromFilePath(file), txt, 'utf8');
}

function execBin (name, cmd = name) {
  const npmPath = transfromFilePath(`@node_modules/${name}`);
  const pkg = require(`${npmPath}/package.json`);

  if (!pkg.bin || !pkg.bin[cmd]) {
    throw new Error(`Wrong cmd: ${name} ${cmd}`);
  }

  const binPath = path.resolve(npmPath, pkg.bin[cmd]);

  return `node ${binPath}`;
}

module.exports = {
  execBin,
  exec,
  copyFile,
  resolveRootPath,
  resolveRelativePath,
  transfromFilePath,
  upcaseFirstLetter,
  writeJsonIntoFile,
  writeStringIntoFile,
  buildPackageJson,
  clearDirectory,
  mkdirDir,
  readFile,
  writeFile,
};
