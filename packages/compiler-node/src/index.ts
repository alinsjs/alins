/*
 * @Author: chenzhongsheng
 * @Date:
 * @Description: Coding something
 */
import {transform} from '@babel/core';
import {createBabelPluginAlins} from 'alins-compiler-core';
import preset from '@babel/preset-react';

export function parseAlins (code: string): string {
    const output = transform(code, {
        sourceMaps: false,
        presets: [ preset ],
        plugins: [ createBabelPluginAlins() ],
    });
    return output.code || '';
}