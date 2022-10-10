/*
 * @Author: tackchen
 * @Date: 2022-08-03 21:07:04
 * @Description: Coding something
 */

const {
  copyFile, buildPackageJson, writeJsonIntoFile,
  writeFile,
} = require('../utils');
const pkg = require('../../package.json');
const {build, builddts} = require('../rollup.base');


async function main () {
  const version = process.argv[2];
  if (!version) throw new Error('Invalid version');
  pkg.version = version;
  writeJsonIntoFile('@package.json', pkg);

  writeFile('@src/version.ts', `export default '${pkg.version}';`);
  await build();
  await builddts();
  buildPackageJson();
  copyFiles();
}


function copyFiles () {
  copyFile('@LICENSE', '@npm/LICENSE');
  copyFile('@README.md', '@npm/README.md');
}

main();

