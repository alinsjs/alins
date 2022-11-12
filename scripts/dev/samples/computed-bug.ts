/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 09:21:14
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 09:49:43
 */

import {
    mount, div, react, comp, button,
    IReactItem, click, prop, css, style,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json
} from '../alins';


const list = $([1, 2, 3]);

div.for(list)((item, index) =>
    div($`${index}: ${item}`)
).mount();

button('switch item', click(() => {
    const a = list[0].value;
    list[0] = list[2].value;
    list[2] = a;
})).mount(); ;

const list2 = $([{
    name: 'bob', age: 10
}, {
    name: 'tack', age: 11
}, {
    name: 'allen', age: 13
}]);

div.for(list2)((item, index) =>
    div($`${index}: ${item.name}(${item.age})`)
).mount();

const o = $({a: {b: 1}});
o.a = {b: 2};
const oav = o.a[json]();
const oa = o.a[value];
o.a[value] = {b: 2};

const a = $(1);

button('switch item2', click(() => {
    const a = list2[0][value];
    
    list2[0] = list2[2][value];
    list2[2] = a;
    list2[0] = {name: 'bob', age: 10};
})).mount(); ;