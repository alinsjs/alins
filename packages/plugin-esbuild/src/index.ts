
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
// import {parseAlins} from 'packages/compiler-node';
import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';
import fs from 'fs';
// import {A} from './index.d';
// const a: A = {a: 1};
// console.log(a, bt);
export default () => {
    return {
        name: 'alins',
        setup (build: any) {
            build.onLoad({filter: /\.tsx$/}, async (args: any) => {
                const source = await fs.promises.readFile(args.path, 'utf8');
                console.log('esbuild-plugin-alins', source);
                const result = parseAlins(source);
                console.log('esbuild-plugin-alins', result);
                return {
                    contents: result,
                    loader: 'js'
                };
            });
        }
    };
};