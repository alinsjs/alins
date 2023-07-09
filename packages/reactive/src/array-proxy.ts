/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-08 15:34:30
 * @Description: Coding something
 */

import {assignLast, empty, IProxyData, trig, util} from 'packages/utils/src';
import {createProxy} from './proxy';

export enum OprateType {
    Replace = 0, // Replace index a => b
    Remove, // remove index count
    Insert, // insert index, [...]
    Push, // [...]
    Sort,
}

export interface IOprationAction {
    type: OprateType;
    index: number;
    data: any[];
    count: number; // remove count
    fromAssign?: boolean;
}

function proxyItem (data: IProxyData<any[]>, args: any[], index: number) {
    
    if (data[util].shallow) return args;
    return args.map((item, i) => {
        if (item && typeof item === 'object') {
            // debugger;
            return createProxy(item, {
                commonLns: data[util].commonLns,
                path: data[util].path,
                key: `${index + i}`,
            });
        }
        return item;
    });
}

// ! 此处用于模拟触发watch 因为proxy拦截数组方法之后 原本的数组元素proxy不生效了 会导致watch行为不一致
function triggerOprationEvent (arr: any[], type: OprateType, index:number, data: any[], count: number, fromAssign?:boolean) {
    const ut = arr[util];
    // const moveArr = (moveStep: number) => {
    //     for (let i = arr.length - 1; i > index; i--) {
    //         const newItem = arr[i];
    //         const oldItem = arr[i + moveStep];
    //         if (newItem) oldItem ? (newItem[util] = oldItem[util]) : assignLast(newItem[util].path, i + moveStep);
    //         ut.triggerChange(`${i + moveStep}`, newItem, oldItem, false, typeof oldItem === 'undefined');
    //     }
    // };
    // switch (type) {
    //     case OprateType.Push: {
    //         data.forEach((item, i) => {
    //             ut.triggerChange(`${(index + i)}`, item, undefined, false, true);
    //         });
    //     };break;
    //     case OprateType.Replace: {
    //         if (!fromAssign) {
    //             ut.triggerChange('' + index, data[0], data[1], false, typeof data[0] === 'undefined');
    //         } else {
    //         }
    //     };break;
    //     case OprateType.Remove: {
    //         // ! 往前移动
    //         for (let i = index; i < arr.length + count - 1; i++) {
    //             const newIndex = i + count;
    //             const oldIndex = i;
    //             const newItem = arr[newIndex];
    //             const oldItem = arr[oldIndex];
    //             if (newItem) oldItem ? (newItem[util] = oldItem[util]) : assignLast(newItem[util].path, oldIndex);
    //             ut.triggerChange(`${oldIndex}`, newItem, oldItem, false, typeof oldItem === 'undefined');
    //         }
    //     };break;
    //     case OprateType.Insert: {
    //         // ! 往后移动
    //         console.log(index, count);
    //         for (let i = arr.length + count - 1; i >= index + count; i--) {
    //             const oldIndex = i;
    //             const newIndex = i - count;
    //             const newItem = arr[newIndex];
    //             const oldItem = arr[oldIndex];
    //             if (newItem) oldItem ? (newItem[util] = oldItem[util]) : assignLast(newItem[util].path, oldIndex);
    //             ut.triggerChange(`${oldIndex}`, newItem, oldItem, false, typeof oldItem === 'undefined');
    //         }
    //         debugger;
    //         data.forEach((item, i) => {
    //             ut.triggerChange(`${(index + i)}`, item, arr[index + i], false);
    //         });
    //     };break;
    // }
    arr[trig]?.forEach(fn => {fn({type, data, index, count, fromAssign});});
}

const ArrayMap = {
    splice (this: {target: IProxyData<any[]>, origin: any}, start: number, count: number, ...args: any[]) {
        // if(this)
        const {target, origin} = this;
        const newCount = args.length;
        const replaceNum = Math.min(count, newCount);
        const n = start + replaceNum;
        const result: any = null;
        const proxy = target[util].proxy;
        if (newCount > count) { // insert
            const data = proxyItem(target, args.slice(replaceNum), n);
            triggerOprationEvent(target, OprateType.Insert, n, data, data.length);
            // console.log('Insert', n, args.slice(replaceNum));
            // result = origin.call(proxy, n, 0, ...data);
        } else {
            const size = count - newCount; // 需要删除的数量
            triggerOprationEvent(target, OprateType.Remove, n, target.slice(n, n + size), size);
            // console.log('Remove', n, count - newCount);
            // result = origin.call(proxy, n, size);
        }
        for (let i = start; i < n; i++) {
            const data = args[i - start];
            // [new,old]
            triggerOprationEvent(target, OprateType.Replace, i, [data, target[i]], 1);
            // // console.log('Replace', i, this[i], args[i - start]);
            // if (data && typeof data === 'object') {
            //     target[i][util].replace(args[i - start]);
            // } else {
            //     proxy[i] = data;
            // }
        }
        return origin.call(proxy, start, count, ...args); ;
    },
    push (this: {target: IProxyData<any[]>, origin: any}, ...args: any[]) {
        // console.log('Push', args);
        const {target, origin} = this;
        args = proxyItem(target, args, target.length);
        triggerOprationEvent(target, OprateType.Push, target.length, args, args.length);
        return origin.call(target, ...args);
    },
    pop (this: {target: IProxyData<any[]>, origin: any}) {
        const {target, origin} = this;
        triggerOprationEvent(target, OprateType.Remove, target.length - 1, [target[target.length - 1]], 1);
        // console.log('Remove', this.length - 1, 1);
        return origin.call(target);
    },
    unshift (this: {target: IProxyData<any[]>, origin: any}, ...args: any[]) {
        // console.log('Insert', );
        const {target, origin} = this;
        args = proxyItem(target, args, 0);
        triggerOprationEvent(target, OprateType.Insert, 0, args, args.length);
        return origin.call(target, ...args);
    },
    shift (this: {target: IProxyData<any[]>, origin: any}) {
        // console.log('Remove', 0, 1);
        const {target, origin} = this;
        triggerOprationEvent(target, OprateType.Remove, 0, target[0], 1);
        return origin.call(target);
    },
    sort (this: {target: IProxyData<any[]>, origin: any}, compareFn?: ((a: any, b: any) => number) | undefined) {
        const {target, origin} = this;
        const originData = [...target];
        const result = origin.call(target, compareFn);
        const n = result.length;
        for (let i = 0; i < n; i++) {
            if (originData[i] !== result[i]) {
                // Sort 作为另外一种类型 移动dom元素 修改索引 既可以
                triggerOprationEvent(target, OprateType.Replace, i, [result[i], originData[i]], 1);
                // console.log('Replace', i, origin[i], result[i]);
            }
        }
        return result;
    },
    replace (target: any, index: number, ov: any, v: any, fromAssign?: boolean) {
        console.warn('replace=======', index, ov, v, fromAssign);
        triggerOprationEvent(target, OprateType.Replace, index, [v, ov], 1, fromAssign);
        if (target[index] && v && typeof v === 'object') {
            target[index][util].replace(v);
        } else {
            target[index] = v;
        }
    }
};

let mapFunc: any = null;

export function registArrayMap (fn: any) {
    mapFunc = fn;
}

export function arrayFuncProxy (target: any, property: string, receiver: any) {
    if (ArrayMap[property] && target[trig] && !target[property].hack) {
        target[property] = ArrayMap[property].bind({target, origin: target[property]});
        target[property].hack = true;
        return target[property];
    }
    if (property === 'map' && mapFunc) {
        return mapFunc.bind(target);
    }
    return Reflect.get(target, property, receiver);
}

export function replaceArrayItem (target: any, property: string, v: any, receiver: any) {
    if (target[trig]) {
        ArrayMap.replace(target, parseInt(property), target[property], v, true);
        return true;
    }
    return empty;
}

function testSpliceRemove (flag = true) {

    const list = react([{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}]);

    if (flag)
        watchArray(list, ({index, count, data, type, fromAssign}) => {
            console.warn('type======', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data.map(i => JSON.stringify(i)));
        });
    watch(list, (...args) => console.warn('watch======', args, JSON.stringify(args[0]), JSON.stringify(args[1])));
    
    list.splice(1, 2, {a: 0});
}
window.testSpliceRemove = testSpliceRemove;

function testSpliceInsert (flag = true) {

    const list = react([{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}]);

    const result: any = [];

    if (flag)
        watchArray(list, ({index, count, data, type, fromAssign}) => {
            console.warn('type======', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data.map(i => JSON.stringify(i)));
        });
    watch(list, (...args) => {
        // result.push()
        console.warn('watch======', args, JSON.stringify(args[0]), JSON.stringify(args[1]));
    });
    
    list.splice(1, 1, {a: 0}, {a: 1});
}
window.testSpliceInsert = testSpliceInsert;