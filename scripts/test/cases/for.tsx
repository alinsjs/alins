/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-31 19:42:31
 */
import {JSX as React} from 'packages/core/src/element/element';
import {createTestBase} from '../test-util';

// const w = window as any;

export default [
    {
        name: '基础for 简单类型',
        disabled: true,
        test () {
            const {list, ctx, data, arr, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                // return arrObj.map((item, index)=><div>{index}-{()=>item.a}</div>, true)
                return arr.map((item, index) => <span>{() => index.v}-{() => item.v};</span>, true, 'item', 'index');
            })();
            append(dom);
            collect();
            arr[1] = 3;
            collect();
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-3;2-3;',
        ]
    },
    {
        name: '基础for 赋值',
        disabled: true,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map((item, index) => <span>{() => index.v}-{() => item.v.a};</span>, true, 'item', 'index');
            })();
            append(dom);
            // window.arrObj = arrObj;

            // arrObj.unshift({a:4})

            // const temp = arrObj[2];
            // arrObj[2] = arrObj[1];
            // arrObj[1] = temp;

            // // collect();
            // arrObj[1].a = 11;
            // arrObj[2].a = 22;
            collect();
            arrObj[1] = {a: 4};
            collect();
            arrObj[1].a = 5;
            collect();
            // 交换测试
            const temp = arrObj[2];
            arrObj[2] = arrObj[1];
            collect();
            arrObj[1] = temp;
            collect();
            arrObj[1].a = 6;
            collect();
            arrObj[2].a = 7;
            collect();
            arrObj[1] = {a: 8};
            collect();
            const temp2 = arrObj[2];
            arrObj[2] = arrObj[1];
            collect();
            arrObj[1] = temp2;
            collect();
            arrObj[1].a = 11;
            collect();
            arrObj[2].a = 22;
            collect();
            arrObj[2] = {a: 222};
            collect();
            // window.arrObj = arrObj;
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-4;2-3;',
            '0-1;1-5;2-3;',
            '0-1;1-5;2-5;',
            '0-1;1-3;2-5;',
            '0-1;1-6;2-5;',
            '0-1;1-6;2-7;',
            '0-1;1-8;2-7;',
            '0-1;1-8;2-8;',
            '0-1;1-7;2-8;',
            '0-1;1-11;2-8;',
            '0-1;1-11;2-22;',
            '0-1;1-11;2-222;',
        ]
    },
    {
        name: 'push-pop-shift-unshift',
        disabled: true,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map((item, index) => <span>{() => index.v}-{() => item.v.a};</span>, true, 'item', 'index');
            })();
            append(dom);

            // arrObj.unshift({a: 5}, {a: 1});
            // arrObj[1].a = 11;

            collect();
            arrObj.push({a: 4}, {a: 5});
            collect();
            arrObj[3].a = 5;
            collect();
            arrObj[3] = {a: 6};
            collect();
            arrObj.pop();
            collect();
            arrObj.shift();
            collect();
            arrObj.unshift({a: 5}, {a: 1});
            collect();
            arrObj[1].a = 11;
            collect();
            arrObj[1] = {a: 111};
            collect();
            // window.arrObj = arrObj;
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-2;2-3;3-4;4-5;',
            '0-1;1-2;2-3;3-5;4-5;',
            '0-1;1-2;2-3;3-6;4-5;',
            '0-1;1-2;2-3;3-6;',
            '0-2;1-3;2-6;',
            '0-5;1-1;2-2;3-3;4-6;',
            '0-5;1-11;2-2;3-3;4-6;',
            '0-5;1-111;2-2;3-3;4-6;',
        ]
    },
    {
        name: 'splice',
        disabled: false,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map((item, index) => <span>{() => index.v}-{() => item.v.a};</span>, true, 'item', 'index');
            })();
            append(dom);
            collect();
            arrObj.splice(1, 3, {a: 6});
            collect();
            arrObj[1].a = 66;
            collect();
            arrObj[1] = {a: 6};
            collect();
            arrObj.splice(1, 0, {a: 8}, {a: 9});
            collect();
            arrObj.splice(1, 3);
            collect();
            arrObj.splice(1, 1, {a: 6}, {a: 7});
            collect();
            arrObj[1].a = 66;
            collect();
            arrObj.splice(0, 1);
            collect();
            arrObj[0].a = 6;
            collect();
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-6;',
            '0-1;1-66;',
            '0-1;1-6;',
            '0-1;1-8;2-9;3-6;',
            '0-1;',
            '0-1;1-6;2-7;',
            '0-1;1-66;2-7;',
            '0-66;1-7;',
            '0-6;1-7;',
        ]
    },
    {
        name: 'Sort',
        disabled: false,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const arr = ctx.$([{a: 3}, {a: 2}, {a: 5}]);
            const dom = (() => {
                return arr.map((item,index) => <span>{() => index.v}-{() => item.v.a};</span>, true, 'item', 'index');
            })();
            append(dom);
            arr.push({a: 4}, {a: 1});
            collect();
            arr.sort((a, b) => a.a - b.a);
            collect();
            const temp = arr[2];
            arr[2] = arr[1];
            collect();
            arr[1] = temp;
            collect();
            arr[0].a = 0;
            collect();
            arr[1].a = 11;
            collect();
            arr[1] = {a: 111};
            collect();
            // arrObj[1].a = 11;
            // collect();
            // window.arr = arr;
            return list;


            // const ctx = createContext();
            // const arr = ctx.$([{a: 2}, {a: 1}]);
            // const container = document.createElement('div');
            // document.body.appendChild(container);
            // const dom = arr.map($s => <span>{() => $s.index}-{() => $s.item.a};</span>, true, 'item', 'index');
            // container.appendChild(dom);
            // arr.sort((a, b) => a.a - b.a);
            // window.arr = arr;
            // return [];
        },
        expect: [
            '0-3;1-2;2-5;3-4;4-1;',
            '0-1;1-2;2-3;3-4;4-5;',
            '0-1;1-2;2-2;3-4;4-5;',
            '0-1;1-3;2-2;3-4;4-5;',
            '0-0;1-3;2-2;3-4;4-5;',
            '0-0;1-11;2-2;3-4;4-5;',
            '0-0;1-111;2-2;3-4;4-5;',
        ]
    },
    {
        name: 'reverse sort fill',
        disabled: false,
        test () {
            const {list, ctx, data, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const arrObj = ctx.$([{a: 2}, {a: 1}, {a: 3}]);
            const dom = (() => {
                return arrObj.map((item,index) => <span>{() => index.v}-{() => item.v.a};</span>, true, 'item', 'index');
            })();
            // window.arrObj = arrObj;
            append(dom);
            arrObj.sort((a, b) => a.a - b.a);
            collect();
            arrObj.reverse();
            collect();
            arrObj.fill({a: 0}, 1);
            collect();
            arrObj[0].a = 0;
            collect();
            arrObj[1].a = 11;
            collect();
            arrObj[2] = {a: 22};
            collect();
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-3;1-2;2-1;',
            '0-3;1-0;2-0;',
            '0-0;1-0;2-0;',
            '0-0;1-11;2-11;',
            '0-0;1-11;2-22;',
        ]
    }


];