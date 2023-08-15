const {execSync} = require('child_process');

/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-09 21:23:17
 * @Description: Coding something
 */
const packages = process.argv.slice(2);
console.log(packages);

for (const name of packages) {
    console.log(`Start build: ${name}`);
    execSync(`npm run buildsingle ${name}`);
}