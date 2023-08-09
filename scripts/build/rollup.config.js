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

function parseBuildConfig () {

    const dirName = process.env.DIR_NAME;

    const BuildMap = {
        'client-core': {
            packageName: 'alins',
            // format: 'esm umd',
            format: 'iife',
            umdName: 'Alins',
        },
        'client-reactive': {
            packageName: 'alins-reactive',
            format: 'esm umd',
            umdName: 'AlinsReactive',
        },
        'client-utils': {
            packageName: 'alins-utils',
            format: 'esm umd',
        },
        'client-standalone': {
            packageName: 'alins-standalone',
            format: 'esm umd iife',
            umdName: 'Alins',
        },
        'compiler-core': {
            packageName: 'alins-compiler-core',
            format: 'esm umd cjs',
            umdName: 'AlinsCompiler',
            // format: 'cjs'
        },
        'compiler-node': {
            packageName: 'alins-compiler-node',
            // format: 'esm cjs',
            format: 'umd',
        },
        'compiler-web': {
            packageName: 'alins-compiler-web',
            format: 'esm umd iife',
            umdName: 'AlinsWeb',
        },
        'plugin-babel': {
            packageName: 'babel-plugin-alins',
            // format: 'esm cjs',
            format: 'cjs',
        },
        'plugin-babel-preset': {
            packageName: 'babel-preset-alins',
            // format: 'esm cjs',
            format: 'cjs',
            external: true,
        },
        'plugin-vite': {
            packageName: 'vite-plugin-alins',
            // format: 'esm cjs',
            format: 'esm',
        },
        'plugin-webpack': {
            packageName: 'alins-loader',
            // format: 'esm cjs',
            format: 'cjs',
            external: 'esbuild',
        },
        'plugin-esbuild': {
            packageName: 'esbuild-plugin-alins',
            // format: 'esm cjs',
            format: 'cjs',
        },
        'plugin-rollup': {
            packageName: 'rollup-plugin-alins',
            // format: 'esm cjs',
            format: 'cjs',
            external: 'esbuild',
        },
    };
    
    const buildConfig = BuildMap[dirName];
    
    const {
        packageName, umdName
    } = buildConfig;
    
    const format = buildConfig.format.split(' ');
    
    const dtsFormat = format[0];
    
    const extensions = ['.ts', '.d.ts', '.js'];
    
    const inputFile = resolvePackagePath(`${dirName}/src/index.ts`);
    console.log(inputFile);

    // process.exit(0);

    let external = [];
    if (buildConfig.external === true) {
        const packageInfo = extractSinglePackageInfo(dirName);
        external = packageInfo.dependencies;
    } else if (typeof buildConfig.external === '') {
        external = buildConfig.external.split(' ');
    }
    console.log('external: ', external);

    return {
        packageName, umdName, dtsFormat, extensions,
        inputFile, dirName, format, external
    };
}

const {
    packageName, umdName, dtsFormat, extensions,
    inputFile, dirName, format, external
} = parseBuildConfig();

console.log('external', external);

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
        external,
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
            file: resolvePackagePath(`${dirName}/dist/${packageName}.${dtsFormat}.min.d.ts`),
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


