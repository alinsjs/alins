
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {IParserOptions, parseAlins} from 'alins-compiler-node';

export default function rollupPluginAlins () {
    return {
        name: 'alins',
        transform (source: string, id: string) {
            if (!/\.[jt]sx$/.test(id)) return source;
            // console.log('rollup 1-----', source);

            const options: IParserOptions = {
                filename: id
            };
            
            if (/\.tsx$/.test(id)) {
                options.ts = true;
            }
            // console.log('rollup 2-----', source);
            const result = parseAlins(source);
            // console.log('rollup 3-----', result);
            return result;
        },
    };
}