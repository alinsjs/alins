/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-09 23:34:59
 * @Description: Coding something
 */


const root = window.Alins.useRenderer();

let v = 0;
const v2 = v * 2;

<div $mount={root}>
    value = {v}
    <div>value * 2 = {v2}</div>
</div>;

function loopRender () {
    v ++;
    console.clear();
    root.render();
    setTimeout(loopRender, 1000);
}

loopRender();
