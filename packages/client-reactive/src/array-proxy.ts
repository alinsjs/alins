/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-08 15:34:30
 * @Description: Coding something
 */

import { empty, IProxyData, trig, util } from 'alins-utils';
import { createProxy } from './proxy';

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
    // const ut = arr[util];
    // @ts-ignore
    arr[trig]?.forEach((fn: any) => {fn({ type, data, index, count, fromAssign });});
}

function wrapArrayCall (target: IProxyData<any[]>, fn:()=>any) {
    // ! 某些方法不需要replaceLns处理 ! 是否可能有bug
    target[util].replaceLns = false;
    const result = fn();
    delete target[util].replaceLns;
    return result;
}

const ArrayMap = {
    splice (this: {target: IProxyData<any[]>, origin: any}, start: number, count?: number, ...args: any[]) {
        const { target, origin } = this;
        // console.log('splice', start, count);
        if (start >= target.length) {
            start = target.length;
            count = 0;
        } else if (typeof count === 'undefined' || start + count > target.length) {
            count = target.length - start;
        }
        const newCount = args.length;
        const replaceNum = Math.min(count, newCount);
        const n = start + replaceNum;
        // const result: any = null;
        if (newCount > count) { // insert
            const data = proxyItem(target, args.slice(replaceNum), n);
            triggerOprationEvent(target, OprateType.Insert, n, data, data.length);
            // console.log('Insert', n, args.slice(replaceNum));
        } else {
            const size = count - newCount; // 需要删除的数量
            triggerOprationEvent(target, OprateType.Remove, n, target.slice(n, n + size), size);
            // console.log('Remove', n, count - newCount);
        }
        for (let i = start; i < n; i++) {
            const data = args[i - start];
            // [new,old]
            triggerOprationEvent(target, OprateType.Replace, i, [ data, target[i] ], 1);
        }
        const items = target[util].scopeItems;
        // @ts-ignore
        const data = items?.slice(start, start + args.length).map(i => i[items.key].v);
        // @ts-ignore
        return wrapArrayCall(target, () => origin.call(target[util].proxy, start, count, ...data));
    },
    push (this: {target: IProxyData<any[]>, origin: any}, ...args: any[]) {
        // console.log('Push', args);
        const { target, origin } = this;
        args = proxyItem(target, args, target.length);
        triggerOprationEvent(target, OprateType.Push, target.length, args, args.length);
        return origin.call(target[util].proxy, ...args);
    },
    pop (this: {target: IProxyData<any[]>, origin: any}) {
        const { target, origin } = this;
        if (target.length > 0) {
            triggerOprationEvent(target, OprateType.Remove, target.length - 1, [ target[target.length - 1] ], 1);
        }
        // console.log('Remove', this.length - 1, 1);
        return origin.call(target[util].proxy);
    },
    unshift (this: {target: IProxyData<any[]>, origin: any}, ...args: any[]) {
        // console.log('Insert', );
        const { target, origin } = this;
        args = proxyItem(target, args, 0);
        triggerOprationEvent(target, OprateType.Insert, 0, args, args.length);
        return wrapArrayCall(target, () => origin.call(target[util].proxy, ...args));
    },
    shift (this: {target: IProxyData<any[]>, origin: any}) {
        // console.log('Remove', 0, 1);
        const { target, origin } = this;
        if (target.length > 0) {
            triggerOprationEvent(target, OprateType.Remove, 0, target[0], 1);
        }
        return origin.call(target[util].proxy);
    },
    replace (target: any, index: number, ov: any, v: any) {
        // console.warn('replace=======', index, ov, v);
        triggerOprationEvent(target, OprateType.Replace, index, [ v, ov ], 1);
        target[index] = v;
    },
};

const mapFunc: any = {
    // todo
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    // indexOf (this: any[]) {

    // },
    // lastIndexOf () {

    // },
    // includes () {

    // },
    // find () {

    // },
    // filter () {

    // },
    // some () {

    // },
    // every () {

    // },
};

export function registArrayMap (fn: any) {
    mapFunc.map = fn;
}

export function arrayFuncProxy (target: any, property: string, receiver: any) {
    // @ts-ignore
    if (ArrayMap[property] && target[trig] && !target[property].hack) {
        // @ts-ignore
        target[property] = ArrayMap[property].bind({ target, origin: target[property] });
        target[property].hack = true;
        return target[property];
    }
    if (mapFunc[property]) {
        return mapFunc[property].bind(target);
    }
    return Reflect.get(target, property, receiver);
}

export function replaceArrayItem (target: any, property: string, v: any) {
    if (target[trig]) {
        ArrayMap.replace(target, parseInt(property), target[property], v);
        return true;
    }
    return empty;
}

// ! 对于绑定dom的数组赋值，实际上并不进行真正的赋值
export function replaceWholeArray (origin: any[], v: any[]) {
    // console.log(origin[trig], origin, v );
    // debugger;
    if (!origin[trig]) return empty;
    v[trig] = origin[trig];
    const on = origin.length, vn = v.length;
    const min = Math.min(on, vn);


    for (let i = 0; i < min; i++) {
        triggerOprationEvent(origin, OprateType.Replace, i, [ v[i], origin[i] ], 1);
        origin[util].data[i] = v[i];
    }

    if (on === vn) return true;

    if (on > vn) {
        // @ts-ignore
        triggerOprationEvent(origin, OprateType.Remove, min, null, on - vn);

        // window.ccc.forEach(f => f());
        // window.ccc = null;
        origin[util].proxy.splice(min);
    } else {
        const data = v.slice(min);
        // triggerOprationEvent(origin, OprateType.Push, min, data, vn - on);
        origin[util].proxy.push(...data);
    }

    return true;
}

// function testSpliceRemove (flag = true) {

//     const list = react([{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}]);

//     if (flag)
//         watchArray(list, ({index, count, data, type, fromAssign}) => {
//             console.warn('type======', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data.map(i => JSON.stringify(i)));
//         });
//     watch(list, (...args) => console.warn('watch======', args, JSON.stringify(args[0]), JSON.stringify(args[1])));

//     list.splice(1, 2, {a: 0});
// }
// window.testSpliceRemove = testSpliceRemove;

// function testSpliceInsert (flag = true) {

//     const list = react([{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}]);

//     const result: any = [];

//     if (flag)
//         watchArray(list, ({index, count, data, type, fromAssign}) => {
//             console.warn('type======', ['replace', 'remove', 'insert', 'push'][type], `index=${index}; count=${count}`, 'data=', data.map(i => JSON.stringify(i)));
//         });
//     watch(list, (...args) => {
//         // result.push()
//         console.warn('watch======', args, JSON.stringify(args[0]), JSON.stringify(args[1]));
//     });

//     list.splice(1, 1, {a: 0}, {a: 1});
// }
// window.testSpliceInsert = testSpliceInsert;