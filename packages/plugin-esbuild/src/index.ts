
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {parseAlins} from 'alins-compiler-node';
import fs from 'fs';

export default () => {
    return {
        name: 'alins',
        setup (build: any) {
            // console.log('build', build);

            const compile = async (args: any, ts = false) => {
                let source = await fs.promises.readFile(args.path, 'utf8');
                // console.log('esbuild-plugin-start', source);
                if (ts) {
                    // ! 此处使用自带的esbuild
                    source = build.esbuild.transformSync(source, {
                        // loader: 'tsx',
                        // jsx: 'preserve',
                        loader: 'ts', // todo 验证只使用 ts是否可行
                    }).code;
                    // console.log('esbuild-plugin-ts-result', source);
                }
                // console.log('esbuild-plugin-alins', source);
                const result = parseAlins(source);
                // console.log('esbuild-plugin-alins', result);
                return {
                    contents: result,
                    loader: 'js'
                };
            };
            build.onLoad({filter: /\.tsx$/}, (args: any) => {
                // console.log('onLoad tsx');
                return compile(args, true);
            });
            build.onLoad({filter: /\.jsx$/}, (args: any) => {
                return compile(args);
            });
        }
    };
};