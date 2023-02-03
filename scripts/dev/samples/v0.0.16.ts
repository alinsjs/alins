/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 19:15:26
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 12:25:50
 */

import {
    mount, div, span, react, comp, button,
    click, prop, css, style, computed,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json, pseudo, useAdoptedStyle,
} from '../alins';

const win = window as any;

// passed
// function textAndElementOrder () {
//     // , span('theajack')
//     div(span('web-os'), ' :22.cc:44 ', text(' made by '), '33', text('11')).mount();
// }
// textAndElementOrder();

// 数组length监听问题 fixed
// function lengthComputed () {
//     const list = $([1]);
//     win.l = list;
//     // const obj = $({a: 1});
//     // const bool = $(true);
    
//     const len = computed(() => list.length === 0);
//     div.show(len)('11111').mount();
//     win.list = list;
// list.splice(0, 1);
// list.push(1);

// }
// lengthComputed();

// fixed
// useAdoptedStyle(false);
// css('.aa')(
//     ['.bb, &.cc', style.color('#111')],
//     style.color('#aaa')
// ).mount();