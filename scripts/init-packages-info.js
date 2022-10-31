/*
 * @Author: tackchen
 * @Date: 2022-07-06 11:55:38
 * @Description: 初始化package.json，
 *  包含 main,typings,publishConfig
 *  复制 remade.md, .npmignore
 */


const {initPackageInfo, resolveRootPath, writeJsonIntoFile} = require('./build/utils');

const isDev = process.argv[2] === 'dev';

initPackageInfo(isDev);

let version = process.argv[3];

if (version) {
    const path = resolveRootPath('package.json');
    const package = require(path);
    if (version[0] === 'v') version = version.substring(1);
    package.version = version;
    writeJsonIntoFile(package, path);
}