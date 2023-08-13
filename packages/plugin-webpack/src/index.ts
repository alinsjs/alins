
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {parseAlins, IParserOptions} from 'alins-compiler-node';
// import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';

export default function AlinsLoader (this: any, source: string)  {
    const id = this.resourcePath;
    console.log('this.resourcePath', id);
    if (!/\.[jt]sx$/.test(id)) return source;
    // console.log('AlinsLoader', source, id);

    const options: IParserOptions = {
        filename: id
    };
    if (/\.tsx$/.test(id)) {
        options.ts = true;
    }
    options.useImport = false;
    const result = parseAlins(source, options);
    // console.log('AlinsLoader22', result);
    return result;
}
  