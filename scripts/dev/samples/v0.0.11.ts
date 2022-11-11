/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-11 07:24:29
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-11 08:57:52
 */

import {div, text, $, input, on, click, style} from '../alins';

const str = $('..aa/aa[aa=11]ss');

// 1. 新增 text函数
div(text(str), click.stop, style.join(style('color:red;'))).mount();
div(text(() => str.value + 11), div('111')).mount();
input(text(() => str.value + 11)).mount();

style('11');
style({});
style({});

// 2. atomstyle 新增 join 函数

// 3. comp 科里化

// 4. 事件声明

// 5. click.stop

// 去除重复 split，ts声明修复

// 7. computed 闭包问题