/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
// import vuePlugin from 'rollup-plugin-vue';
// import yaml from '@rollup/plugin-yaml';
import commonjs from '@rollup/plugin-commonjs';
import {uglify} from 'rollup-plugin-uglify';
import path from 'path';

const {
    extrackSinglePackageInfo,
    resolvePacakgePath,
    upcaseFirstLetter,
    buildPackageName,
} = require('./utils');

const dirName = process.env.PACKAGE_NAME;
const packageInfo = extrackSinglePackageInfo(dirName);

const extensions = ['.ts', '.d.ts', '.js'];

const isMainPackage = dirName === 'main';

const inputFile = resolvePacakgePath(`${dirName}/src/index.ts`);
console.log(inputFile);

const packageName = buildPackageName(dirName);

const config = [
    {
    // 编译typescript, 生成 js 文件
        input: inputFile,
        output: {
            file: resolvePacakgePath(`${dirName}/dist/${packageName}.min.js`),
            format: 'umd',
            name: `Alins${isMainPackage ? '' : upcaseFirstLetter(dirName)}`,
        },
        plugins: [
            uglify(),
            // commonjs(),
            // yaml(),
            // vuePlugin(),
            typescript(),
            nodeResolve({
                extensions,
            }),
            babel({
                exclude: 'node_modules/**',
                extensions,
                configFile: path.join(__dirname, './babel.config.js'),
            }),
        ],
        sourceMap: false,
        external: packageInfo.dependencies,
    },
    {
    // 生成 .d.ts 类型声明文件
        input: inputFile,
        output: {
            file: resolvePacakgePath(`${dirName}/dist/${packageName}.d.ts`),
            format: 'es',
        },
        plugins: [dts()],
    },
];

export default config;


