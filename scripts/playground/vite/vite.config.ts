/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:44:54
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-10 00:05:08
 */
import {defineConfig} from 'vite';
// import alins from '../../packages/plugin-vite/dist/alins-vite-plugin.esm.min';
import alins from 'vite-plugin-alins';

export default defineConfig({
    plugins: [
        alins()
    ]
});