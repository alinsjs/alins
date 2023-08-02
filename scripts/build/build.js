/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */

const execa = require('execa');
const {resolveRootPath} = require('./utils');

const dirName = process.argv[2];
 
console.log(`dirName=${dirName}`);

const BuildMap = {
    'client-core': {
        packageName: 'alins',
        format: ['esm', 'umd'],
        umdName: 'Alins',
    },
    'client-reactive': {
        packageName: 'alins-reactive',
        format: ['esm', 'umd'],
        umdName: 'AlinsReactive',
    },
    'client-utils': {
        packageName: 'alins-utils',
        format: ['esm', 'umd'],
    },
    'client-standalone': {
        packageName: 'alins-standalone',
        format: ['esm', 'umd', 'iife'],
        umdName: 'Alins',
    },
    'compiler-core': {
        packageName: 'alins-compiler-core',
        format: ['esm', 'umd'],
        umdName: 'AlinsCompiler',
    },
    'compiler-node': {
        packageName: 'alins-compiler-node',
        format: ['esm', 'cjs'],
    },
    'compiler-web': {
        packageName: 'alins-compiler-web',
        format: ['esm', 'umd', 'iife'],
        umdName: 'AlinsWeb',
    },
    'plugin-babel': {
        packageName: 'alins-babel-plugin',
        format: ['esm', 'cjs'],
    },
    'plugin-vite': {
        packageName: 'alins-vite-plugin',
        format: ['esm', 'cjs'],
    },
};

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


