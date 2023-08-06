
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
// import {parseAlins} from 'packages/compiler-node';
import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.esm.min';
// import {A} from './index.d';
// const a: A = {a: 1};
// console.log(a, bt);
function AlinsVitePlugin ()  {
    return {
        name: 'vite:alins',
  
        // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
        // enforce: 'pre',
  
        transform (code: string, id: string) {
            if (!id.endsWith('.tsx')) return null;
            // return {code: test(code)};
            console.log(code);
            const result = parseAlins(code);
            console.log(result);
            return {code: result};
        },
        // handleHotUpdate () {
        //     compiler.reset();
        // }
    };
}
export default AlinsVitePlugin;
  