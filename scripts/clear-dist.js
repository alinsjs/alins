/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-13 17:02:07
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../packages');

const pkgs = fs.readdirSync(pkgPath);

pkgs.forEach(name => {
    if (name === '.DS_Store') return;
    const dirName = path.resolve(pkgPath, `./${name}/dist`);
    if (!fs.existsSync(dirName)) return;
    
    const files = fs.readdirSync(dirName);

    files.forEach(file => {
        fs.rmSync(path.resolve(dirName, file));
    });

    fs.rmdirSync(dirName);
});