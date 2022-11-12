/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-11 07:24:29
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-11 11:52:26
 */

import {div, text, $, input, on, click, style, comp, prop, dom} from '../alins';

const str = $('..aa/aa[aa=11]ss');


const v1 = $(10);
const v2 = $(20);

const rb = $`marginLeft: 10px;`;

const joinStyle = style.marginTop(30).join(style`fontSize: ${v1}px;margin:${v2}px;`, {
    paddingLeft: v1,
    paddingRight: v2
}).join('backgroundColor: #eee;', rb);

// 1. 新增 text函数
div(text(str), click.stop, joinStyle).mount();
div(text(() => str.value + 11), div('111')).mount();
input(text(() => str.value + 11)).mount();

style('11');
style({
    backdropFilter: 1,
});
style({});

function TextComp ({props}) {
    return div(text($`aa.[]a-${props.test}`));
}

comp(TextComp)(prop({test: 111})).mount(); ;


// 2. atomstyle 新增 join 函数

// 3. comp 科里化

// 4. 事件声明

// 5. click.stop

// 去除重复 split，ts声明修复

// 7. computed 闭包问题