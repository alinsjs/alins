/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 22:36:16
 * @Description: Coding something
 */
import {createBabelPluginAlins} from 'alins-compiler-core';

// @ts-ignore
const plugin: (data: any, args?: {useImport?: boolean}) => {
    name: string;
    visitor: any;
} = createBabelPluginAlins();

export default plugin;