/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-14 09:14:23
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-09 17:04:56
 */
import {JSX as React} from 'packages/core/src/element/element';
import {createTestBase} from '../test-util';

const w = window as any;

export default [
    {
        name: '基础for',
        disabled: true,
        test () {
            const {list, ctx, data, arr, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arr.map((item, index)=><div>{index}-{item}</div>, true)
            })();
            append(dom);
            collect();
            data.a = 3;
            collect();
            w.arr = arr;
            return list;
        },
        expect: ['1', '2', 'end', '3', 'end']
    },
    {
        name: '基础for',
        disabled: false,
        test () {
            const {list, ctx, data, arrObj, collect, append} = createTestBase();
            // const Child = () => <div>child</div>;
            const dom = (() => {
                return arrObj.map((item, index)=><div>{index}-{()=>item.a}</div>, true)
                // return arrObj.map(item=><div>{()=>item.index}-{()=>item.item.a}</div>, true)
            })();
            append(dom);
            collect();
            data.a = 3;
            collect();
            w.arrObj = arrObj;
            return list;
        },
        expect: ['1', '2', 'end', '3', 'end']
    },
];