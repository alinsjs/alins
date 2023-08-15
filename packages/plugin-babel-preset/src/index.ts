/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 22:36:16
 * @Description: Coding something
 */
export default function (babel: any, {
    useImport, ts, jsx
}: {
    useImport?: boolean;
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
        plugins: [[
            require('babel-plugin-alins'), {useImport}
        ]],
        presets,
    };
}