
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {parseAlins} from 'alins-compiler-node';
// import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';
import {transformSync} from 'esbuild';

export default function AlinsLoader (this: any, source: string)  {
    const id = this.resourcePath;
    if (!/\.[jt]sx$/.test(id)) return source;
    // console.log('AlinsLoader', source, id);
    if (/\.tsx$/.test(id)) {
        source = transformSync(source, {
            loader: 'tsx',
            jsx: 'preserve'
        }).code;
    }
    const result = parseAlins(source);
    // console.log('AlinsLoader22', result);
    return result;
}
  