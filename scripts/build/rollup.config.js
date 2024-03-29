/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:12:31
 * @Description: Coding something
 */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
// import typescript from 'rollup-plugin-typescript2';
import typescript from '@rollup/plugin-typescript';
// import vuePlugin from 'rollup-plugin-vue';
// import yaml from '@rollup/plugin-yaml';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import json from '@rollup/plugin-json';
// import commonjs from '@rollup/plugin-commonjs'
import path from 'path';
import fs from 'fs';
import replace from '@rollup/plugin-replace';

const {
    extractSinglePackageInfo,
    resolvePackagePath,
    // upcaseFirstLetter,
    // resolveRootPath,
} = require('./utils');

let isWebPackage = false;

const isDev = process.env.ENV === 'dev';

console.log('isDev = ', isDev);

// npx lerna version 0.0.29 --no-git-tag-version --force-publish --yes
// npm run build

function parseBuildConfig () {

    const dirName = process.env.DIR_NAME;

    // web => main: umd, module: esm, iife
    // node => main: cjs, module: esm,

    // ! 会将第一个format作为main
    const BuildMap = {
        'client-core': isDev ? {
            packageName: 'alins',
            umdName: 'Alins',
            format: 'iife',
            external: false,
        } : {
            packageName: 'alins',
            type: 'web',
            umdName: 'Alins',
        },
        'client-reactive': {
            packageName: 'alins-reactive',
            type: 'web',
            // format: 'esm umd',
            umdName: 'AlinsReactive',
        },
        'client-utils': {
            packageName: 'alins-utils',
            type: 'web',
            umdName: 'AlinsUtil',
            // format: 'esm umd',
        },
        'client-standalone': isDev ? {
            packageName: 'alins-standalone',
            format: 'iife',
            umdName: 'Alins',
            external: false,
        } : {
            packageName: 'alins-standalone',
            type: 'web',
            // format: 'esm umd iife',
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
            type: 'node',
            // format: 'esm cjs',
        },
        'compiler-web': isDev ? {
            packageName: 'alins-compiler-web',
            format: 'iife',
            umdName: 'AlinsWeb',
            external: false,
        } : {
            packageName: 'alins-compiler-web',
            type: 'web',
            umdName: 'AlinsWeb',
        },
        'plugin-babel': {
            packageName: 'babel-plugin-alins',
            type: 'node',
            // format: 'esm cjs',
        },
        'plugin-eslint': {
            packageName: 'eslint-config-alins',
            format: 'cjs',
        },
        'plugin-babel-preset': isDev ? {
            packageName: 'babel-preset-alins',
            format: 'cjs',
            external: false,
        } : {
            packageName: 'babel-preset-alins',
            type: 'node',
            // format: 'esm cjs',
        },
        'plugin-vite': isDev ? {
            packageName: 'vite-plugin-alins',
            format: 'esm',
            external: false,
        } : {
            packageName: 'vite-plugin-alins',
            type: 'node',
        },
        'plugin-webpack': {
            packageName: 'alins-loader',
            type: 'node',
            // format: 'cjs',
            // external: false,
        },
        'plugin-esbuild': {
            packageName: 'esbuild-plugin-alins',
            type: 'node',
        },
        'plugin-rollup': {
            packageName: 'rollup-plugin-alins',
            type: 'node',
        },
    };

    const buildConfig = BuildMap[dirName];

    const {
        packageName, umdName, type
    } = buildConfig;

    if (!buildConfig.format) {
        if (type === 'web') {
            isWebPackage = true;
            buildConfig.format = 'umd esm iife';
        } else {
            buildConfig.format = 'cjs esm';
        }
    }

    const format = buildConfig.format.split(' ');

    const dtsFormat = format[0];

    const extensions = [ '.ts', '.d.ts', '.js' ];

    const inputFile = resolvePackagePath(`${dirName}/src/index.ts`);
    console.log(inputFile);

    // process.exit(0);

    let version = '';

    let external = [];
    if (buildConfig.external !== false) {
        if (typeof buildConfig.external === 'string') {
            external = buildConfig.external.split(' ');
        } else if (buildConfig.external !== false) {
            const packageInfo = extractSinglePackageInfo(dirName);
            external = packageInfo.dependencies;
            version = packageInfo.version;
        }
    }
    console.log('external: ', external);

    return {
        packageName, umdName, dtsFormat, extensions,
        inputFile, dirName, format, external, version
    };
}

const {
    packageName, umdName, extensions,
    inputFile, dirName, format, external, version
} = parseBuildConfig();

if (packageName === 'eslint-config-alins') {
    modifyPackage(pkg => {
        delete pkg.unpkg;
        delete pkg.jsdelivr;
        delete pkg.typings;
        delete pkg.module;
        pkg.type = 'commonjs';
        pkg.main = 'index.js';
    });
    process.exit(0);
}

// console.log('external', external);

const packageInfo = {
    typings: `dist/${packageName}.d.ts`,
    'publishConfig': {
        'registry': 'https://registry.npmjs.org/',
    },
};

const replacement = {
    '__DEV__': 'false',
    '__DEBUG__': 'false',
    '__VERSION__': `"${version}"`
};

const createBaseConfig = (format) => {

    const bundleName = `${packageName}.${format}.min.js`;

    if (format === 'iife') {
        packageInfo.unpkg = `dist/${bundleName}`;
        packageInfo.jsdelivr = `dist/${bundleName}`;
        isWebPackage = true;
    } else if (format === 'umd') {
        packageInfo.main = `dist/${bundleName}`;
    } else if (format === 'cjs') {
        packageInfo.main = `dist/${bundleName}`;
        packageInfo.type = 'commonjs';
    } else if (format === 'esm') {
        packageInfo.module = `dist/${bundleName}`;
    }

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
            typescript(),
            commonjs(),
            nodeResolve({
                extensions: [ '.js' ],
            }),
            babel({
                exclude: 'node_modules/**',
                extensions,
                configFile: path.join(__dirname, './babel.config.js'),
            }),
            replace(replacement)
        ],
        // external: [], // format === 'iife' ? [] : external,
        external: format === 'iife' ? [] : external,
    };
};

const config = [
    ...format.map(item => {
        return createBaseConfig(item);
    }),
    createDTSConfig(packageName),
];

function createDTSConfig (name) {
    return {
        // 生成 .d.ts 类型声明文件
        input: inputFile,
        output: {
            file: resolvePackagePath(`${dirName}/dist/${name}.d.ts`),
            format: 'es',
        },
        plugins: [ dts(), json() ],
    };
}

modifyPackage(pkg => {
    Object.assign(pkg, packageInfo);
    if (!isWebPackage) {
        delete pkg.unpkg;
        delete pkg.jsdelivr;
    }
    if (pkg.version.includes('beta')) {
        pkg.publishConfig.tag = 'beta';
    }
});

const pkgPath = resolvePackagePath(`${dirName}/package.json`);
const pkg = require(pkgPath);
Object.assign(pkg, packageInfo);
if (!isWebPackage) {
    delete pkg.unpkg;
    delete pkg.jsdelivr;
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4), 'utf8');

function modifyPackage (fn) {
    const pkgPath = resolvePackagePath(`${dirName}/package.json`);
    const pkg = require(pkgPath);
    fn(pkg);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4), 'utf8');
}

export default config;


