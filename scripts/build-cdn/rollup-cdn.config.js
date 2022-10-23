/*
 * @Author: tackchen
 * @Date: 2022-07-20 11:06:11
 * @Description: Coding something
 */
import {nodeResolve} from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
// import fs from 'fs';
// import alias from '@rollup/plugin-alias';
// import nodePolyfills from 'rollup-plugin-polyfill-node';
import {uglify} from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import {babel} from '@rollup/plugin-babel';

const packageName = process.env.PACKAGE_NAME;
const {
    resolveRootPath,
    // buildPackageName,
} = require('../build/utils');

const map = {
    core: ['Alins', 'alins'],
    style: ['AlinsStyle', 'alins-style'],
    'pure-style': ['AlinsStyle', 'alins-pure-style'],
};

const [varName, fileName] = map[packageName];

const extensions = ['.ts', '.d.ts', '.js'];

const inputFile = resolveRootPath(`scripts/build-cdn/cdn-${packageName}.js`);

const outputFile = resolveRootPath(`cdn/${fileName}.min.js`);

const config = [
    {
        input: inputFile,
        output: {
            file: outputFile,
            format: 'iife',
            name: varName
        },
        plugins: [
            uglify(),
            // commonjs(),
            // nodePolyfills(),
            typescript(),
            // json(),
            // commonjs({
            //     extensions: ['.ts', '.d.ts', '.js'];
            // }),
            nodeResolve({
                extensions,
            }),
            babel({
                exclude: 'node_modules/**',
                extensions,
                configFile: path.join(__dirname, '../build/babel.config.js'),
            }),
        ],
    },
];

export default config;


