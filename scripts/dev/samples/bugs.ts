/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 09:21:14
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 14:49:35
 */


import {
    mount, div, react, comp, button,
    click, prop, css, style,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json
} from '../alins';

const num = $(-1);

div(
    comp(() => div('comp show')).show(() => num.value > 0)(),
    comp(() => div('comp show2')).if(() => num.value > 0)(),
).mount();