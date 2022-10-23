
const {extractPackagesInfo, writeJsonIntoFile} = require('./build/utils');

const info = extractPackagesInfo();

writeJsonIntoFile(info, 'scripts/helper/packages-info.json');

console.log(info);
 