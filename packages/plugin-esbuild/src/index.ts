
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
            console.log('build', build);

            // // ! set jsx preserve
            // build.initialOptions.jsx = 'preserve';

            const compile = async (args: any, ts = false) => {
                let source = await fs.promises.readFile(args.path, 'utf8');
                console.log('esbuild-plugin-start', source);
                if (ts) {
                    source = build.esbuild.transformSync(source, {
                        loader: 'tsx',
                        jsx: 'preserve'
                    }).code;
                    console.log('esbuild-plugin-ts-result', source);
                }
                console.log('esbuild-plugin-alins', source);
                const result = parseAlins(source);
                console.log('esbuild-plugin-alins', result);
                return {
                    contents: result,
                    loader: 'js'
                };
            };
            build.onLoad({filter: /\.tsx$/}, (args: any) => {
                console.log('onLoad tsx');
                return compile(args, true);
            });
            build.onLoad({filter: /\.jsx$/}, (args: any) => {
                return compile(args);
            });
        }
    };
};