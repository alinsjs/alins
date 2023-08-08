
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import {parseAlins} from 'alins-compiler-node/dist/alins-compiler-node.umd.min';

export default function AlinsVitePlugin ()  {
    return {
        name: 'alins',
  
        config: () => ({
            esbuild: {
                jsx: 'preserve'
            }
        }),
  
        transform (code: string, id: string) {
            if (!/\.[jt]sx$/.test(id)) return null;
            return {code: parseAlins(code)};
        },
        // handleHotUpdate () {
        // }
    };
}
  