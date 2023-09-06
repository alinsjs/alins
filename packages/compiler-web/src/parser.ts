/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 14:35:14
 * @Description: Coding something
 */
// ! 模改babel-standalone 目的是为了去掉babel内部自动执行 text/babel 的逻辑
import Babel from './babel.min';
import { createBabelPluginAlins, IParserOptions, randomTsxFileName } from 'alins-compiler-core';

Babel.registerPlugin('alins', createBabelPluginAlins());

export function parseWebAlins (code: string, {
    ts, useImport, filename
}: IParserOptions = { useImport: false }): string {
    const options = {
        sourceMaps: false,
        presets: [ 'react' ],
        plugins: [ [ 'alins', { useImport } ] ],
    };
    if (ts) {
        options.presets.push('typescript');
        // @ts-ignore
        options.filename = filename || randomTsxFileName();
    }
    const output = Babel.transform(code, options);
    return output.code || '';
}
