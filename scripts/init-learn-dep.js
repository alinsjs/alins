
const execa = require('execa');
const {resolveRootPath, writeStringIntoFile} = require('./build/utils');
// const { exec } = require('./helper/tool');

const map = require(resolveRootPath('scripts/helper/dependent-graph.json'));

function buildLearnAdd () {
    const addArr = [];
    for (const key in map) {
        const arr = map[key];

        arr.forEach((dep) => {
            addDep(dep, key, (str) => {
                console.log(str);
                addArr.push(str);
            });
        });
    }

    writeStringIntoFile(addArr.join('\n'), 'scripts/lerna-add.txt');
}

function addDep (dep, key, success) {
    execa('lerna', [
        'add',
        dep,
        `--scope=${key}`,
    ]).then(() => {
        success(`lerna add ${dep} --scope=${key}`);
    });
}

buildLearnAdd();

