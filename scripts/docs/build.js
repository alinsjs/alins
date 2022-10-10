/*
 * @Author: tackchen
 * @Date: 2022-09-28 00:48:05
 * @Description: Coding something
 */


const {build} = require('../rollup.base');
const {copyFile} = require('../utils');

// function modIndexHtmlVersion () {
//   const version = process.argv[2] || 'latest';
//   const html = readFile('@scripts/build/docs/index.html');
//   const res = html.match(new RegExp(`https://cdn.jsdelivr.net/npm/disable-devtool@.*/disable-devtool.min.js#use`));
//   mkdirDir('@docs');
//   if (res) {
//     copyFile('@.gitignore', '@docs/.gitignore');
//     writeFile('@docs/index.html', html.replace(res[0], `https://cdn.jsdelivr.net/npm/disable-devtool@${version}/disable-devtool.min.js#use`));
//   }
// }
async function main () {
  await build({
    input: '@scripts/docs/docs.ts',
    output: '@docs/docs.min.js',
    format: 'iife',
  });
  copyFile('@.gitignore', '@docs/.gitignore');
  copyFile('@scripts/docs/index.html', '@docs/index.html');
}

main();
