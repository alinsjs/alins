// import './samples/memory-leak';

// import './samples/v0.0.15';
import './samples/v0.0.16';

// import './samples/v0.0.13';
// import './samples/bugs';
// import './samples/computed-bug';

// import './samples/v0.0.11';

// import {
//     mount, div, react, comp, button,
//     IReactItem, click, prop, css, style,
//     $, input, mounted, updated, created, removed, appended,
//     html, text
// } from './alins';
// import {Count, CountProps} from './samples/count';
// import {For3} from './samples/for-3';
// import {Parent, testLife} from './samples/hello-world';
// import {StyleComp, StyleDemo} from './samples/style-comp';
// import {todoList} from './samples/todo-list';
// import {Style2, StyleAtom} from './samples/style-comp2';
// import {Count2} from './samples/counter2';
// import {renderObject} from './samples/render-obj';
// import {Controller} from './samples/controller';
// import {onlyUseStyle} from './samples/style-only';
// import {Life} from './samples/life';
// import {CompController} from './samples/comp-controller';
// import {FuncBuilder} from './samples/func-as-builder';
// import {htmlComp} from './samples/html';
// import {initMount} from './samples/mount';
// import {CompParent} from './samples/comp';
// import './samples/slot-demo';
// import './samples/react';
// const num = $(20);
// (window as any).numx =  num;
// const titleBg = $('#ddd');
// css()(
//     ['body', style({
//         backgroundColor: '#111',
//         color: '#fff'
//     }), $`transition: color 1s linear;marginLeft: ${num}px`, 'marginTop: 10px'],
//     ['.title', style('marginLeft: 10px;'), style`
//         fontWeight: bold;
//         fontSize: ${num}px;
//         color: #f44;
//         marginTop: 10px;
//         marginBottom: 5px;
//         backgroundColor: ${titleBg};
//     `]
// ).mount();

// // const msg = $('xxxx');
// // div(msg).mount();


// const list = $([1, 2, 3]);
// const add = (item: IReactItem, e: Event) => {item.value++; console.log(e);};
// const value = $(0);
// const value1 = $(1);
// const value2 = $(2);
// const msg = $('Hello msg');
// (window as any).valuex = value;

// mount(
//     div('title font-size:',
//         () => [
//             div('111111'),
//             div('111111222')
//         ],
//         input.model(num, 'number')),
//     div(msg),
//     // () => div('111111'),
// );

// div.show(() => value.value === 0)('test controller mount').mount();
// initMount();

// mount(
//     div('Hello World'),
//     div('title font-size:', input.model(num, 'number')),
//     div('title background:', input.model(titleBg)),
//     div('.title:comp Parent--------------'),
//     comp(CompParent),
//     () => div(111, text(':11/11.[1]')),
//     () => [div(222), div(333)],
//     comp(() => div(444)),
//     div('.title:comp HTML--------------'),
//     comp(htmlComp),
//     div('.title:comp Life--------------'),
//     comp(Life),
//     div('.title:comp CompController--------------'),
//     comp(CompController),
//     div('.title:style Demo--------'),
//     comp(StyleDemo),
//     div('.title:Count------------------'),
//     comp(Count),
//     div('.title:Count------------------'),
//     div(comp(renderObject)),
//     div('.title:todoList-----------'),
//     comp(todoList),
//     div('.title:Parent-----------'),
//     comp(Parent),
//     div('.title:For3-----------'),
//     comp(For3),
//     div('.title:Count-----------'),
//     comp(Count),
//     div('.title:Count2-----------'),
//     comp(Count2),
//     div('.title:FuncBuilder-----------'),
//     comp(FuncBuilder),
//     div('.title:testLife-----------'),
//     comp(testLife),
//     div('.title:StyleComp-----------'),
//     comp(StyleComp),
//     div('.title:StyleComp2----------'),
//     comp(Style2),
//     div('.title:StyleAtom----------'),
//     comp(StyleAtom),
//     div('.title:Controllers----------'),
//     comp(Controller),
//     div('.title:单独使用style----------'),
//     onlyUseStyle()
// );

// // dom 单独使用
