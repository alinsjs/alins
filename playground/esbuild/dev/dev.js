/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 09:07:13
 * @Description: Coding something
 */
const esbuild = require('esbuild');
const path = require('path');
// const alins = require('../../../packages/plugin-esbuild/dist/esbuild-plugin-alins.cjs.min');
const alins = require('esbuild-plugin-alins');

main(
    path.resolve(__dirname, '../src/index.ts'),
    path.resolve(__dirname, './bundle.js')
);

async function main (entry, outfile) {
    const context = await esbuild.context({
        entryPoints: [ entry ],
        outfile,
        bundle: true,
        sourcemap: false,
        format: 'iife',
        plugins: [alins()],
    });
    await context.watch();
    console.log(`watching: ${outfile}`);
}

// console.log(esbuild.transformSync(`
// import {createContext as _$$} from '../../../packages/client-core/dist/alins.esm.min'
// import plugin from '../../../packages/plugin-babel/src/index';

// let count = 1;

// let React: any;

// <button
//     $parent={document.body}
//     onclick={() => {count++;}}
// >click:{count}</button>;
// `, {
//     loader: 'tsx',
//     jsx: 'preserve',
// }));