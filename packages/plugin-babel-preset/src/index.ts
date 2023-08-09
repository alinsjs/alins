/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 22:36:16
 * @Description: Coding something
 */
export default function (args: {
    ts?: boolean,
    jsx?: boolean,
} = {}) {
    const presets: any[] = [];
    if (args?.ts) {
        presets.push(require('@babel/preset-typescript'));
    }
    if (args?.jsx !== false) {
        presets.push(require('@babel/preset-react'));
    }
    return {
        plugins: [require('babel-plugin-alins')],
        presets,
    };
}