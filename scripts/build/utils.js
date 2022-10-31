/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const rootPkg = require('../../package.json');

function resolveRootPath (str) {
    return path.resolve(__dirname, `../../${str}`);
}

function resolvePacakgePath (str) {
    return path.resolve(__dirname, `../../packages/${str}`);
}

function extrackSinglePackageInfo (dir) {
    const {name, version, dependencies} = require(resolvePacakgePath(`${dir}/package.json`));
    return {
        name,
        version,
        dependencies: dependencies ? Object.keys(dependencies) : [],
    };
}

function extractPackagesInfo () {
    const dirs = fs.readdirSync(resolveRootPath('packages'));

    return dirs.map(dir => extrackSinglePackageInfo(dir));
}

function upcaseFirstLetter (str) {
    if (typeof str !== 'string' || !str) return '';
    return str[0].toUpperCase() + str.substr(1);
}

function buildPackageName (dir) {
    return `alins${dir === 'core' ? '' : `-${dir}`}`;
}

function traverseDir (path, callback) {
    const dirs = fs.readdirSync(path);

    dirs.forEach((dir) => {
        if (dir === '.DS_Store') return;

        callback(dir);
    });
}

function initPackageInfo (isDev) {
    traverseDir(resolveRootPath('packages'), (dir) => {
        initSinglePackageInfo(dir, isDev);
    });
}

function initSinglePackageInfo (dir, isDev = false) {
    const packagePath = resolvePacakgePath(`${dir}/package.json`);
    const package = require(packagePath);
    const packageName = buildPackageName(dir);

    if (isDev) {
        package.main = 'src/index.ts';
        package.typings = 'src/index.ts';
    } else {
        package.main = `dist/${packageName}.esm.js`;
        package.typings = `dist/${packageName}.d.ts`;
        package.unpkg = `dist/${packageName}.min.js`;
        package.jsdelivr = `dist/${packageName}.min.js`;
    }
    ['description', 'author', 'repository', 'license'].forEach(name => {
        package[name] = rootPkg[name];
    });
    package.publishConfig = {
        registry: 'https://registry.npmjs.org/',
    };
    writeJsonIntoFile(package, packagePath);
    fs.copyFileSync(resolveRootPath('README.md'), resolvePacakgePath(`${dir}/README.md`));
    fs.copyFileSync(resolveRootPath('LICENSE'), resolvePacakgePath(`${dir}/LICENSE`));
    fs.copyFileSync(resolveRootPath('scripts/helper/.npmignore'), resolvePacakgePath(`${dir}/.npmignore`));

    const tsconfig = require(resolveRootPath('tsconfig.json'));
    tsconfig.include = ['src/**/*'];
    tsconfig.compilerOptions.rootDir = '../..';
    writeJsonIntoFile(tsconfig, resolvePacakgePath(`${dir}/tsconfig.json`));
}

function writeJsonIntoFile (package, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(package, null, 4), 'utf8');
}

function writeStringIntoFile (str, filePath) {
    fs.writeFileSync(filePath, str, 'utf8');
}

async function exec (cmd) {
    return new Promise(resolve => {
        childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                resolve({success: false, stdout, stderr});
            } else {
                resolve({
                    success: true,
                    stdout,
                    stderr
                });
            }
        });
    });
}
module.exports = {
    extrackSinglePackageInfo,
    resolveRootPath,
    resolvePacakgePath,
    extractPackagesInfo,
    upcaseFirstLetter,
    buildPackageName,
    initPackageInfo,
    initSinglePackageInfo,
    writeJsonIntoFile,
    writeStringIntoFile,
    traverseDir,
    exec,
};
