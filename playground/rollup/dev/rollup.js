/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 17:03:59
 * @Description: Coding something
 */
/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 17:03:59
 * @Description: Coding something
 */
const rollup = require('rollup');
const path = require('path');
// const typescript = require('@rollup/plugin-typescript');
const alins = require('../../../packages/plugin-rollup/dist/rollup-plugin-alins.cjs.min');

build();

async function build () {
    rollup.watch({
        input: path.resolve(__dirname, './alins.tsx'),
        plugins: [
            // typescript(),
            alins(),
        ],
        output: {
            file: path.resolve(__dirname, './bundle.js'),
            format: 'iife',
        }
    });
}

