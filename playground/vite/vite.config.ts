/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:44:54
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-08 09:33:15
 */
import { defineConfig } from 'vite';
import alins from '../../packages/plugin-vite/dist/alins-vite-plugin.esm.min';
// import alins from '../../packages/plugin-vite';

export default defineConfig({
    
    esbuild: {
      jsx: 'preserve',  // ! todo 看看能否把这个配置包含在alins插件中
    },
    resolve: {
      alias: {
      },
    },
    plugins: [
      alins()
    ]
});