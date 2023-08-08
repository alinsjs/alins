
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';
import {transformSync} from 'esbuild';

export default function rollupPluginAlins () {
    return {
        name: 'alins',
        transform (source: string, id: string) {
            if (!/\.[jt]sx$/.test(id)) return source;
            console.log('rollup 1-----', source);
            if (/\.tsx$/.test(id)) {
                source = transformSync(source, {
                    loader: 'tsx',
                    jsx: 'preserve'
                }).code;
            }
            console.log('rollup 2-----', source);
            let result = parseAlins(source);
            result = result.replace('/*#__PURE__*/', '');
            console.log('rollup 3-----', result);
            return result;
        },
    };
}