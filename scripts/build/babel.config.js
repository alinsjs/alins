/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-04 10:31:48
 * @Description: Coding something
 */
module.exports = {
    plugins: [ 'babel-plugin-replace-ts-export-assignment' ],
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'entry',
                targets: {
                    esmodules: true,
                    ie: 11,
                },
            },
        ],
        '@babel/preset-typescript',
    ],
};

