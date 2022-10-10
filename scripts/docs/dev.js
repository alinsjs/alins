/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:37:59
 * @Description: Coding something
 */
const {exec} = require('../utils');
const {
  buildBaseConfig,
  esbuild
} = require('../esbuild.base');

exec('serve scripts/docs');

esbuild(buildBaseConfig({
  inputFile: '@scripts/docs/docs.ts',
  outFile: '@scripts/docs/bundle.js',
}));