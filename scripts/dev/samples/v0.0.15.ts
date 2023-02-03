/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 19:15:26
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 11:31:17
 */

import {
    mount, div, span, react, comp, button,
    click, prop, css, style, computed,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json, pseudo,
} from '../alins';

const win = window as any;

// passed
// function getColorTest () {
//     const sss = style.color('#fff').marginTop(1);
//     console.log(sss.get('color'));
// }
// getColorTest();

function textAndElementOrder () {
    // , span('theajack')
    div(span('web-os'), text(' made by '), text('11')).mount();
}
textAndElementOrder();


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

// passed
// function testComputedWidthController () {
//     const num = $(3);

//     const comput = computed(() => num.value + 1);
//     const bool = computed(() => num.value < 4);

//     div.show(bool)('show').mount();
//     div.if(bool)('if').mount();
//     div.switch(comput)
//         .case(4)('switch4')
//         .case(3)('switch3').mount();

//     win.num = num;
//     num.value ++; num.value = 2;
// }

// passed
// function recycleList () {

//     const arr = new Array(1000);
//     arr.fill(1);
    
//     const list = $(arr);
//     win.rl = list;

//     // rl[value] = [];
// }
// recycleList()