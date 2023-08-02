/*
 * @Author: chenzhongsheng
 * @Date:
 * @Description: Coding something
 */
import {transform} from '@babel/core';
import {babelPluginAlins} from 'alins-compiler-core';

export function parseAlins (code: string): string {
    const output = transform(code, {
        sourceMaps: false,
        presets: [ '@babel/preset-react' ],
        plugins: [ babelPluginAlins ],
    });
    return output.code || '';
}