/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 22:36:16
 * @Description: Coding something
 */
export default function (babel: any, options : {
    ts?: boolean,
    jsx?: boolean,
    web?: boolean,
} = {}) {
    const presets: any[] = [];
    if (options?.ts) {
        presets.push(require('@babel/preset-typescript'));
    }
    if (options?.jsx !== false) {
        presets.push(require('@babel/preset-react'));
    }
    return {
        plugins: [[
            require('babel-plugin-alins'), {web: options.web}
        ]],
        presets,
    };
}