/*
 * @Author: tackchen
 * @Date: 2022-09-28 19:52:23
 * @Description: Coding something
 */
const https = require('https');
const {resolveRootPath, traverseDir, buildPackageName} = require('./build/utils');


function purge () {
    traverseDir(resolveRootPath('packages'), dir => {
        const name = buildPackageName(dir);
        https.get(`https://purge.jsdelivr.net/npm/${name}/${name}.min.js`, () => {
        });
        if (dir === 'style') {
            https.get(`https://purge.jsdelivr.net/npm/${name}/alins-style.standalone.min.js`, () => {
            });
        }
    });
}

purge();
