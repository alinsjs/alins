/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 19:15:26
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-28 10:21:40
 */

import {
    mount, div, span, react, comp, button,
    click, prop, css, style, computed,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json, pseudo,
} from '../alins';

// const sss = style.color('#fff').marginTop(1);

// console.log(sss.get('color'));

div(span('web-os'), text(' made by '), span('theajack')).mount();

// const num = $(3);

// const comput = computed(() => num.value + 1);
// const bool = computed(() => num.value < 4);

// div.show(bool)('11111').mount();
// div.if(bool)('111').mount();
// div.switch(comput)
//     .case(4)('4444')
//     .case(3)('3333').mount();


// const list = $([]);

// const len = computed(() => list.length === 0);

// div.show(len)('11111').mount();
