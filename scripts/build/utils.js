/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');

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
    return `alins${dir === 'main' ? '' : `-${dir}`}`;
}

function initPackageInfo (isDev) {
    const dirs = fs.readdirSync(resolveRootPath('packages'));

    dirs.forEach((dir) => {
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
        // package.main = `dist/${packageName}.min.js`;
        // package.typings = `dist/${packageName}.d.ts`;
    }
    package.publishConfig = {
        registry: 'https://registry.npmjs.org/',
    };
    writeJsonIntoFile(package, packagePath);
    fs.copyFileSync(resolveRootPath('README.md'), resolvePacakgePath(`${dir}/README.md`));
    fs.copyFileSync(resolveRootPath('scripts/helper/.npmignore'), resolvePacakgePath(`${dir}/.npmignore`));

    const tsconfig = require(resolveRootPath('tsconfig.json'));
    tsconfig.include = ['src/**/*'];
    writeJsonIntoFile(tsconfig, resolvePacakgePath(`${dir}/tsconfig.json`));
}

function writeJsonIntoFile (package, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(package, null, 4), 'utf8');
}

function writeStringIntoFile (str, filePath) {
    fs.writeFileSync(filePath, str, 'utf8');
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
};
