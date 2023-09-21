/*
 * @Author: chenzhongsheng
 * @Date:
 * @Description: Coding something
 */
import { transform } from '@babel/core';
import { createBabelPluginAlins, IParserOptions, randomTsxFileName } from 'alins-compiler-core';
import react from '@babel/preset-react';
import typescript from '@babel/preset-react';

export { IParserOptions } from 'alins-compiler-core';

export function parseAlins (code: string, {
    ts, importType, filename
}: IParserOptions = {}): string {

    const options = {
        sourceMaps: false,
        presets: [ react ],
        plugins: [ [ createBabelPluginAlins(), { importType } ] ],
    };

    if (ts) {
        options.presets.push(typescript);
        // @ts-ignore
        options.filename = filename || randomTsxFileName();
    } else {
        // @ts-ignore
        if (filename) options.filename = filename;
    }

    const output = transform(code, options);
    return output.code || '';
}