/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 22:35:14
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');

fs.copyFileSync(
    path.resolve(__dirname, '../../../packages/client-core/dist/alins.iife.min.js'),
    path.resolve(__dirname, './alins.min.js')
);