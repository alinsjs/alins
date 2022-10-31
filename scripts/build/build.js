/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */

const execa = require('execa');
const {resolveRootPath} = require('./utils');

const dirName = process.argv[2];
 
console.log(`dirName=${dirName}`);

async function build () {
    await execa(
        resolveRootPath('node_modules/rollup/dist/bin/rollup'),
        [
            '-c',
            resolveRootPath('scripts/build/rollup.config.js'),
            '--environment',
            [
                `PACKAGE_NAME:${dirName}`,
            ],
        ],
        {stdio: 'inherit'},
    );
}

async function main () {
    await build();

    // ! 放在后面做 否则会build失败
    // initSinglePackageInfo(dirName, false);
}

main();


