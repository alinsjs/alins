/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
// import typescript from 'rollup-plugin-typescript2';
import typescript from '@rollup/plugin-typescript';
// import vuePlugin from 'rollup-plugin-vue';
// import yaml from '@rollup/plugin-yaml';
import commonjs from '@rollup/plugin-commonjs';
import {uglify} from 'rollup-plugin-uglify';
import json from '@rollup/plugin-json';
// import commonjs from '@rollup/plugin-commonjs'
import path from 'path';

const {
    extractSinglePackageInfo,
    resolvePackagePath,
    // upcaseFirstLetter,
    // resolveRootPath,
} = require('./utils');

const dirName = process.env.DIR_NAME;
const packageName = process.env.PACKAGE_NAME;
const format = process.env.FORMAT.split(' ');
const umdName = process.env.UMD_NAME;

const umdFormat = format[0];

// process.exit(0);
const packageInfo = extractSinglePackageInfo(dirName);
console.log(packageInfo.dependencies);

const extensions = ['.ts', '.d.ts', '.js'];

const inputFile = resolvePackagePath(`${dirName}/src/index.ts`);
console.log(inputFile);


const createBaseConfig = (format) => {

    const bundleName = `${packageName}.${format}.min.js`;

    return {
        input: inputFile,
        output: {
            file: resolvePackagePath(`${dirName}/dist/${bundleName}`),
            format,
            name: umdName,
            // sourcemap: true,
        },
        plugins: [
            uglify(),
            json(),
            // yaml(),
            // vuePlugin(),
            typescript(),
            commonjs(),
            nodeResolve({
                extensions: ['.js'],
            }),
            babel({
                exclude: 'node_modules/**',
                extensions,
                configFile: path.join(__dirname, './babel.config.js'),
            }),
        ],
        // external: (format === 'esm' || format === 'cjs') ? packageInfo.dependencies : {},
        // external: (format === 'esm') ? packageInfo.dependencies : {},
    };
};

const config = [
    ...format.map(item => {
        return createBaseConfig(item);
    }),
    {
    // 生成 .d.ts 类型声明文件
        input: inputFile,
        output: {
            file: resolvePackagePath(`${dirName}/dist/${packageName}.${umdFormat}.min.d.ts`),
            format: 'es',
        },
        plugins: [dts(), json()],
    },
];

// if (dirName === 'style') {
//     config.push({
//         ...createBaseConfig({
//             format: 'iife',
//             input: resolveRootPath('scripts/build/style-all-cdn.ts')
//         }),
//     });
// }

export default config;


