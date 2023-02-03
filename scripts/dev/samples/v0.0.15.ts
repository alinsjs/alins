/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 19:15:26
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-03 09:40:04
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

// function textAndElementOrder () {
//     div(span('web-os'), text(' made by '), span('theajack')).mount();
// }
// textAndElementOrder();


// 数组length监听问题

const list = $([1]);
// const obj = $({a: 1});
// const bool = $(true);

const len = computed(() => {
    console.log('computed len', list.length, list[0]);
    return list.length === 0;
});

div.show(len)('11111').mount();

// list.push(1);
// list.splice(0, 1);


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

