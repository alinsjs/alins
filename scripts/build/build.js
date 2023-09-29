/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */

const execa = require('execa');
const { resolveRootPath } = require('./utils');

const dirName = process.argv[2];
const env = process.argv[3] || 'prod';

async function build () {
    await execa(
        resolveRootPath('node_modules/rollup/dist/bin/rollup'),
        [
            '-c',
            resolveRootPath('scripts/build/rollup.config.js'),
            '--environment',
            [
                `DIR_NAME:${dirName}`,
                `ENV:${env}`
            ],
        ],
        { stdio: 'inherit' },
    );
}

async function main () {
    await build();

    // ! 放在后面做 否则会build失败
    // initSinglePackageInfo(dirName, false);
}

main();


