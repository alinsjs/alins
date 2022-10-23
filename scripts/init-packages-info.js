/*
 * @Author: tackchen
 * @Date: 2022-07-06 11:55:38
 * @Description: 初始化package.json，
 *  包含 main,typings,publishConfig
 *  复制 remade.md, .npmignore
 */


const {initPackageInfo} = require('./build/utils');

const isDev = process.argv[2] === 'dev';

initPackageInfo(isDev);
 