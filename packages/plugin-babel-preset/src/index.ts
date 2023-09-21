/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 22:36:16
 * @Description: Coding something
 */
export default function (babel: any, {
    importType, ts, jsx
}: {
    importType?: 'cjs' | 'esm' | 'iife';
    ts?: boolean;
    jsx?: boolean
}) {
    const presets: any[] = [];
    if (ts) {
        presets.push(require('@babel/preset-typescript'));
    }
    if (jsx !== false) {
        presets.push(require('@babel/preset-react'));
    }
    return {
        plugins: [ [
            require('babel-plugin-alins'), { importType }
        ] ],
        presets,
    };
}