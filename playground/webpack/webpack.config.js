/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 08:07:14
 * @Description: Coding something
 */
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{loader: 'ts-loader'}]
        }, {
            test: /\.tsx$/,
            use: [
                {loader: '../../packages/plugin-webpack/dist/alins-loader.esm.min.js'},
                {loader: 'ts-loader'}
            ]
        }]
    }
};