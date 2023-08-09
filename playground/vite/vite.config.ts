/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:44:54
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-08 16:47:32
 */
import { defineConfig } from 'vite';
import alins from '../../packages/plugin-vite/dist/alins-vite-plugin.esm.min';
// import alins from '../../packages/plugin-vite';

export default defineConfig({
    plugins: [
      alins()
    ]
});