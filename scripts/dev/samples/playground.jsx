/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-15 11:58:01
 * @Description: Coding something
 */

// @static-scope
function foo () {
    let name = '';
    name ++;
}
// @static-scope
if (true) {
    let name = '';
    name ++;
}
// @static-scope
switch (1) {
    case 1: {
        let name = '';
        name ++;
    }; break;
}
// @static-scope
for (let i = 0; i < 1; i++) {
    let name = '';
    name ++;
}
// @static-scope
{
    let name = '';
    name ++;
};
// @static-scope
test: () => {
    let name = '';
    name ++;
};
<div $$App>Click output to view the compilation product</div>;