
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
// import {parseAlins} from 'packages/compiler-node';
import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';
// import {A} from './index.d';
// const a: A = {a: 1};
// console.log(a, bt);
export default function rollupPluginAlins () {
    return {
        name: 'alins',
        transform (source: string, id: string) {
            if (/\.tsx$/.test(id)) {
                console.log('esbuild-plugin-alins', source);
                const result = parseAlins(source);
                console.log('esbuild-plugin-alins', result);
                return result;
            }
            return source;
        },
    };
}