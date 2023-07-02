import {react} from 'packages/reactive/src/react';
import {observe} from 'packages/reactive/src/proxy';
import {computed} from 'packages/reactive/src/computed';
import {watch} from 'packages/reactive/src/watch';
import {div} from 'packages/core/src/dom-builder';
import {IElement} from 'packages/core/src/renderer';
import {util} from 'packages/utils/src';
import {startTestMain} from '../test/index';
import {$if} from 'packages/core/src/controller/if';

startTestMain();

const $ = react;

const w = window as any;
const addEnv = (data: any) => {Object.assign(w, data);};
addEnv({observe, util});

function testDom () {
    const data = react('111');
    const data2 = react('xx');
    const a = computed(() => data.value + '22');
    div({
        $child: [
            data,
            a,
            div({$child: [
                data,
                a,
                div({}),
            ]}),
        ],
        a: 11,
        b: $`${data}`,
        class: {
            $value: react`${data2}`,
            a: () => data.value === '111',
            b: true,
        }
    }).mount(document.body as IElement);
    addEnv({testDom: {data, data2}});
}

// testDom();

function testIf () {
    const a = react(1);
    const b = react(2);

    addEnv({testIf: {a, b}});

    return $if(() => a.value === 1, () => {
        return div({$child: ['1111']});
    }).elif(() => a.value === 2, () => {
        return $if(() => b.value === 1, () => {
            return div({$child: ['111xxx']});
        }).elif(() => b.value === 2, () => {
            return div({$child: ['222xx']});
        // }).else(() => {
        //     return div({$child: ['3333']});
        });
    // }).else(() => {
    //     return div({$child: ['3333']});
    });

}

div({
    $child: testIf(),
}).mount(document.body);

function testMain () {
    const data = react({a: 1, b: 2, c: []});

    const c = computed(() => data.a + 1);
    const c2 = computed(() => c.value + 1);
    const cset = computed({
        get: () => ({x: c.value + 1}),
        set: (v, ov, path) => {console.log('cset::', v, ov, path);}
    });

    observe(() => {console.log('c.value', c.value, c2.value, cset.x);});

    console.log(
        data[util].lns,
        c[util].lns,
        c2[util].lns,
        cset[util].lns,
    );
    console.log(
        data[util].lns,
        c[util].lns,
        c2[util].lns,
        cset[util].lns,
    );

    Object.assign(w, {main: {data, observe, c, c2, cset, util}});
}

// testMain();

// observe(() => {console.log('c.value', c.value);});

// Object.assign(w, {data, c});

function test2 () {
    const a = react({value: 1});
    const b = react({value: 2});
    const c = react({value: 3});
    const com = computed(() => { return a.value === 1 ? b.value : c.value; });
    // const com = computed(() => { return b.value; });

    b.value = 22;
    console.log(c[util].lns);
    console.assert(com.value === b.value);
    a.value = 2;
    console.log(c[util].lns);
    console.assert(com.value === c.value);
    c.value = 11;
    console.log(c[util].lns, c.value);
    console.assert(com.value === c.value);
    Object.assign(w, {test2: {a, b, c, com}});
}

// test2();

function testWatch () {

    const a = react(1);
    // const b = react(2);
    // const c = react(2);

    // const com = computed(() => { return a.value === 1 ? b.value : c.value; });
    // const fn = () => com.value + 1;
    // const com2 = computed(() => { return fn(); });

    // watch(com2, (a) => {
    //     console.log('1111111', a);
    // });
    const b = react({a: {b: 1}});
    const r2 = watch(b, (a, b, c) => {
        console.log('222222', a, b, c);
    });
    const res = watch(() => {
        console.log('watch start');
        return a.value + 1;
    }, (a, b, c) => {
        console.log('222222', a, b, c);
    });
    const r3 = watch(() => {
        console.log('watch start');
        return b.a.b;
    }, (a, b, c) => {
        console.log('r33333333', a, b, c);
    });
    // const data = react({a: {b: 2}});
    // watch(() => data.a.b, (a, b, c) => {
    //     console.log('222222', a, b, c);
    // });
    Object.assign(w, {testWatch: {a, b, w: res, r3}});
}

// testWatch();

// observe(()=>console.warn('c0=',data.c[0]));
// observe(()=>console.warn(data.c.length === 0));
// data.c=[]
// data.c.push(1)

// import './samples/memory-leak';

// import './samples/v0.0.15';
// import './samples/v0.0.16';


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
// import './samples/controller';

// console.log(Controller);

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
