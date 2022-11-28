/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-27 18:37:53
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-27 21:51:04
 */

import {
    mount, div, react, comp, button,
    click, prop, css, style,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json, pseudo,
} from '../alins';

// const list = $(['1111', '2222', '3333']);

// let i = 0;

// let interval: any = null;

// div(
//     button('click', click(() => {
//         if (!interval) {
//             interval = setInterval(() => {
//                 console.log('click');
//                 i++;
//                 list[value] = ['1111' + i, '2222' + i, '3333' + i];
//             }, 1000);
//         } else {
//             clearInterval(interval);
//         }
//     })),
//     div.for(list)(item => div(item))
// ).mount();

// // 对象

// const list = $({a: 'aaa'});

// let i = 0;

// let interval: any = null;

// div(
//     button('click', click(() => {
//         if (!interval) {
//             interval = setInterval(() => {
//                 console.log('click');
//                 i++;
//                 // list[value] = {a: 'aaa' + i};
//                 list.a = 'aaa' + i;
//             }, 1000);
//         } else {
//             clearInterval(interval);
//         }
//     })),
//     div(list.a)
// ).mount();


// // 原生js

// const div = document.createElement('div');
// div.innerText = 'aaa';
// document.body.appendChild(div);

// let i = 0;
// setInterval(() => {
//     i++;
//     div.innerText = 'aaa' + i;
// }, 1000);