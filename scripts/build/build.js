
const execa = require('execa');
const {resolveRootPath, initSinglePackageInfo} = require('./utils');

const dirName = process.argv[2];
 
console.log(`dirName=${dirName}`);

async function build () {
    if (dirName === 'utils') {
        await execa(
            resolveRootPath('node_modules/rollup/dist/bin/rollup'),
            [
                '-c',
                resolveRootPath('scripts/build/rollup.config.js'),
                dirName,
            ],
            {stdio: 'inherit'},
        );
    }
}

async function main () {
    await build();
    initSinglePackageInfo(dirName, false);
}

main();


