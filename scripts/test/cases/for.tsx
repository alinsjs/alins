/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-10 09:00:51
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
                return arr.map(($s)=><span>{()=>$s.index}-{()=>$s.item};</span>, true, 'item', 'index')
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
        name: '基础for',
        disabled: true,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map(($s)=><span>{()=>$s.index}-{()=>$s.item.a};</span>, true, 'item', 'index')
            })();
            append(dom);
            collect();
            arrObj[1].a = 3;
            collect();
            arrObj[1] = {a: 4};
            collect();
            arrObj[1].a = 5;
            collect();
            // w.arrObj = arrObj;
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-3;2-3;',
            '0-1;1-4;2-3;',
            '0-1;1-5;2-3;',
        ]
    },
    {
        name: 'push-pop-shift-unshift',
        disabled: true,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map(($s)=><span>{()=>$s.index}-{()=>$s.item.a};</span>, true, 'item', 'index')
            })();
            append(dom);
            collect();
            arrObj.push({a: 4}, {a: 5})
            collect();
            arrObj[3].a = 5;
            collect();
            arrObj[3] = {a:6};
            collect();
            arrObj.pop();
            collect();
            // w.arrObj = arrObj;
            return list;
        },
        expect: [
            '0-1;1-2;2-3;',
            '0-1;1-2;2-3;3-4;4-5;',
            '0-1;1-2;2-3;3-5;4-5;',
            '0-1;1-2;2-3;3-6;4-5;',
            '0-1;1-2;2-3;3-6;',
        ]
    },
    {
        name: 'splice',
        disabled: false,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map($s=><span>{()=>$s.index}-{()=>$s.item.a};</span>, true, 'item', 'index')
            })();
            append(dom);
            collect();
            arrObj.splice(1, 3, {a:6});
            collect();
            arrObj[1].a = 66;
            collect();
            arrObj[1] = {a:6};
            collect();
            arrObj.splice(1, 0, {a:8}, {a:9});
            collect();
            arrObj.splice(1, 3);
            collect();
            arrObj.splice(1, 1, {a:6}, {a:7});
            collect();
            arrObj[1].a = 66;
            collect();
            arrObj.splice(0, 1);
            collect();
            arrObj[0].a = 6;
            collect();
            // w.arrObj = arrObj;
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
];