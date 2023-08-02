/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 14:35:14
 * @Description: Coding something
 */
import * as Babel from '@babel/standalone';
import {babelPluginAlins} from 'alins-compiler-core';

Babel.registerPlugin('alins', babelPluginAlins);

export function parseWebAlins (code: string): string {
    const output = Babel.transform(code, {
        sourceMaps: false,
        // presets: [ 'env', 'react' ],
        presets: [ 'react' ],
        plugins: [ 'alins' ],
    });
    return output.code || '';
}