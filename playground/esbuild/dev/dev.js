/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 09:07:13
 * @Description: Coding something
 */
const esbuild = require('esbuild');
const path = require('path');
const alins = require('../../../packages/plugin-esbuild/dist/esbuild-plugin-alins.cjs.min');

main(
    path.resolve(__dirname, '../src/index.ts'),
    path.resolve(__dirname, './bundle.js')
);

async function main (entry, outfile) {
    const context = await esbuild.context({
        jsx: 'preserve', // ! todo 看看能否把这个配置包含在alins插件中
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