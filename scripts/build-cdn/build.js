/*
 * @Author: tackchen
 * @Date: 2022-08-16 18:06:04
 * @Description: Coding something
 */

const execa = require('execa');
const {resolveRootPath} = require('../build/utils');

const packageName = process.argv[2] || 'core';

console.log('build-cdn:', packageName);

async function build () {
    console.log(resolveRootPath('scripts/build-cdn/rollup-cdn.config.js'));
    await execa(
        'node',
        [
            resolveRootPath('node_modules/rollup/dist/bin/rollup'),
            '-c',
            resolveRootPath('scripts/build-cdn/rollup-cdn.config.js'),
            '--environment',
            [
                `PACKAGE_NAME:${packageName}`,
            ],
        ],
        {stdio: 'inherit'},
    );
}

async function main () {
    await build();
}

main();

