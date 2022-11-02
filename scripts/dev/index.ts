/*
 * @Author: tackchen
 * @Date: 2022-07-11 17:17:54
 * @Description: Coding something
 */

import {
    mount, div, react, comp, button,
    IReactItem, click, prop, css, style,
    $, input, mounted, updated, created, removed, appended
} from './alins';
import {Count, CountProps} from './samples/count';
import {For3} from './samples/for-3';
import {Parent, testLife} from './samples/hello-world';
import {StyleComp, StyleDemo} from './samples/style-comp';
import {todoList} from './samples/todo-list';
import {Style2, StyleAtom} from './samples/style-comp2';
import {Count2} from './samples/counter2';
import {renderObject} from './samples/render-obj';
import {Controller} from './samples/controller';
import {onlyUseStyle} from './samples/style-only';
import {Life} from './samples/life';
import {CompController} from './samples/comp-controller';
import {FuncBuilder} from './samples/func-as-builder';
const num = $(20);
(window as any).numx =  num;
const titleBg = $('#ddd');
css('.title')(
    style`
      font-weight: bold;
      font-size: ${num}px;
      color: #f44;
      margin-top: 10px;
      margin-bottom: 5px;
      background-color: ${titleBg};
    `
).mount();

const list = $([1, 2, 3]);
const add = (item: IReactItem, e: Event) => {item.value++; console.log(e);};
const value = $(0);
const value1 = $(1);
const value2 = $(2);
(window as any).valuex = value;

mount(
    div('Hello World'),
    div('title font-size:', input.model(num, 'number')),
    div('title background:', input.model(titleBg)),
    div('.title:comp Life--------------'),
    comp(Life),
    div('.title:comp CompController--------------'),
    comp(CompController),
    div('.title:style Demo--------'),
    comp(StyleDemo),
    div('.title:Count------------------'),
    comp(Count),
    div('.title:Count------------------'),
    div(comp(renderObject)),
    div('.title:todoList-----------'),
    comp(todoList),
    div('.title:Parent-----------'),
    comp(Parent),
    div('.title:For3-----------'),
    comp(For3),
    div('.title:Count-----------'),
    comp(Count),
    div('.title:Count2-----------'),
    comp(Count2),
    div('.title:FuncBuilder-----------'),
    comp(FuncBuilder),
    div('.title:testLife-----------'),
    comp(testLife),
    div('.title:StyleComp-----------'),
    comp(StyleComp),
    div('.title:StyleComp2----------'),
    comp(Style2),
    div('.title:StyleAtom----------'),
    comp(StyleAtom),
    div('.title:Controllers----------'),
    comp(Controller),
    div('.title:单独使用style----------'),
    onlyUseStyle()
);

// dom 单独使用