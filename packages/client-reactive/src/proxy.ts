/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    AlinsType,
    IJson, IOnChange, IProxyData, IProxyListener, IProxyListenerMap,
    type, util
} from 'alins-utils';
import { arrayFuncProxy, replaceWholeArray } from './array-proxy';
import { replaceArrayItem } from './array-proxy';
import { empty, pureproxy } from 'alins-utils';
import { getCurCleaner } from './cleaner';

let currentFn: any = null;
let depReactive = false; // 当前表达式是否依赖响应数据

function execDepFn (fn: ()=>any, curFn: IProxyListener) {
    currentFn = curFn;
    depReactive = false;
    const v = fn();
    currentFn = null;
    return v;
}

export function isDepReactive () {
    return depReactive;
}

export function observe (fn: () => any, listener: IProxyListener) {
    // if (__DEBUG__) console.log('Start observe', fn, listener);
    if (!listener) listener = fn;
    const origin = listener;
    listener = () => {
        // ! 动态收集依赖
        // ! fix computed 遇到 && || 时首次运行可能observe不到后面一个响应式数据的问题
        return execDepFn(fn, origin);
    };
    return execDepFn(fn, listener);
}

export function isRef (data: any): boolean {
    return data?.[type] === AlinsType.Ref;
}

export function isProxy (data: any, checkUtil = false): boolean {
    if (checkUtil && !data?.[util]) return false;
    const t = data?.[type];
    return t === AlinsType.Proxy || t === AlinsType.Ref;
}

export const isReactive = isProxy;

export function mockRef (data: any) {
    return { v: data, [type]: AlinsType.Ref };
}

export function wrapReactive (data: any, force = false) {
    if (force || !data || typeof data !== 'object') {
        // @ts-ignore
        return { v: data, [type]: AlinsType.Ref };
    }
    return data;
}

export function createUtils (
    data: IProxyData<object>,
    key: string,
    path: string[],
): void {
    const current = key ? [ ...path, key ] : [ ...path ];
    const isArray = Array.isArray(data);
    const triggerChange = (property: string, nv: any, old: any, remove?: boolean, isNew?: boolean) => {
        const each = (fn: any) => {
            fn(nv, old, `${current.join('.')}.${property}`, property, remove);
        };
        // ! todo 此处在数据删除时 需要手动清空 commonLns、lns、extraLns，不然会有内存泄露
        if (isNew) data[util].commonLns?.forEach(each);
        data[util].lns[property]?.forEach(each);
        data[util].extraLns?.forEach(item => {
            item[property]?.forEach(each);
        });
    };
    const forceUpdate = () => {
        for (const k in data) {
            // @ts-ignore
            triggerChange(k, data[k], data[k]);
        }
    };
    const forceWrite = (v: any, k?: string) => {
        if (k) {
            triggerChange(k, v, data[k]);
            return v;
        } else {
            for (const k in v) {
                // @ts-ignore
                triggerChange(k, v[k], data[k]);
            }
            Object.assign(data, v);
        }
    };
    const subscribe = (ln: IProxyListener<any>, deep: boolean = true) => {
        // console.trace('subscribe', Object.keys(lns));
        const ut = data[util];
        addLns(ut, 'commonLns', ln);
        for (const k in data) {
            addLns(ut.lns, k, ln);
            // @ts-ignore
            if (deep && isProxy(data[k])) data[k][util].subscribe(ln, deep);
        }
    };
    if (data[util].commonLns) {
        data[util].lns[key] = new Set();
        data[util].commonLns.forEach(item => {data[util].lns[key].add(item);});
    }
    Object.assign(data[util], {
        path: current,
        triggerChange,
        forceWrite,
        subscribe,
        isArray,
        forceUpdate,
    });
}

function isArrayOrJson (o: any) {
    const data = o.constructor.name;
    if (data === 'Object' || data === 'Array') return true;
    return false;
}

function deepReactive (data: any, path: string[]) {
    for (const k in data) {
        const v = data[k];
        if (v && typeof v === 'object') {
            try {
                data[k] = createProxy(v, { path, key: k });
            } catch (e) {
                console.warn(e);
            }
        }
    }
}

export function createProxy<T extends IJson> (data: T, {
    commonLns,
    lns = {}, // lns=>listeners
    shallow = false,
    set,
    get,
    path = [],
    key = '',
    isProp = false,
}: {
    lns?: IProxyListenerMap;
    shallow?: boolean;
    get?: ()=>any,
    set?: IOnChange<any>|null;
    path?: string[];
    key?: string;
    commonLns?: Set<IProxyListener>;
    isProp?: boolean;
} = {}): IProxyData<T> {

    if (!isArrayOrJson(data) || isProxy(data, true)) {
        return data as any;
    }

    if (!shallow) deepReactive(data, path);

    // @ts-ignore
    if (!data[type]) data[type] = AlinsType.Proxy;

    // @ts-ignore
    data[util] = { commonLns, lns, shallow, data };
    // @ts-ignore
    createUtils(data, key, path);
    // @ts-ignore
    const { triggerChange, isArray } = data[util];

    let prevLength = isArray ? data.length : null;

    // @ts-ignore
    const proxy = new Proxy(data, {
        // ! 闭包
        get (target: IJson, property, receiver) {
            // if (property === 'v') console.log('vvvv');
            // console.log('debug: Get property', property);
            // if (property === 'label') console.warn('proxy get', property);
            const isFunc = typeof target[property] === 'function';
            if (isArray && isFunc) {
                // debugger;
                return arrayFuncProxy(target, property as string, receiver);
            }
            if (typeof property !== 'symbol' && !isFunc) {
                // ! 收集依赖
                if (currentFn) {
                    // console.log('collect dep');
                    if (!depReactive) depReactive = true;
                    // console.warn('COLLECT------ ', property, '=', target[property]);
                    addLns(lns, property, currentFn);
                    // ! 当在依赖搜集时 返回缓存的值
                    return Reflect.get(target, property, receiver);
                }
                // if (__DEBUG__) console.log('Proxy.get', target, property);
                if (property === 'v' && get) return get();
            } else if (property === pureproxy) {
                return true;
            }
            return Reflect.get(target, property, receiver);
        },
        // ! 闭包
        set (target: IJson, property, v, receiver) {
            // console.log('debug: Set property', property, v);
            const originSet = () => {
                const value = Reflect.set(target, property, v, receiver);
                if (isArray && property !== 'length' && lns.length?.size) {
                    // 直接对数组赋值 arr[100] = 1; 会增加长度但是不会触发 length的proxy
                    let len = data.length;
                    // console.log('len !== prevLength', len !== prevLength);
                    if (len !== prevLength) {
                        Promise.resolve().then(() => {
                            len = data.length;
                            if (len !== prevLength) {
                                triggerChange('length', len, prevLength, false, false);
                                prevLength = len;
                            }
                        });
                    }
                }
                return value;
            };
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
                // console.log('debug:Proxy.set', target, property, v);
                let origin: any = null;
                if (isArray && property === 'length') {
                    origin = prevLength;
                    prevLength = data[property];
                } else {
                    origin =  target[property];
                }
                if (v === origin && !target[util]?._map) return true;
                if (set === null) { console.warn(`${isProp ? 'props' : 'Computed'} 不可设置`); return true;}
                if (property === 'v' && set) { set(v, origin, `${path.join('.')}.${property as string}`, property); return true; }
                if (v && typeof v === 'object' && !shallow) { // ! 非shallow时 赋值需要createProxy并且将listener透传下去
                    if (!isProxy(v)) {
                        if (origin?.[util]) origin[util].removed = true;
                        v = createProxy(v, {
                            commonLns: target[util].commonLns,
                            lns: origin?.[util]?.lns,
                            shallow,
                            path,
                            key: property as string,
                        });
                    } else {
                        if (!v[pureproxy]) v = v[util].proxy; // ! 如果是伪proxy 则获取真proxy
                        if (isProxy(origin) && data[util].replaceLns !== false) {
                            replaceLNS(v, origin);
                        }
                    }
                }

                let value: any = empty;
                if (isArray && /^\d+$/.test(property)) value = replaceArrayItem(target, property, v);
                if (Array.isArray(v) && Array.isArray(origin)) value = replaceWholeArray(origin, v);
                if (value === empty) value = originSet();
                // ! 执行依赖
                triggerChange(property as string, v, origin, false, typeof origin === 'undefined');
                return value;
            }
            return originSet();
        },
        // ! 闭包
        deleteProperty (target: IJson, property) {
            // console.log('deleteProperty', property);
            // console.log('deleteProperty', target, property);
            triggerChange(property as string, undefined, target[property], true);
            // todo 释放内存
            return Reflect.deleteProperty(target, property);
        }
    }) as IProxyData<T>;
    data[util].proxy = proxy;
    return proxy;
}

export function replaceLNS (nv: IProxyData<any>, origin: IProxyData<any>) {
    const ut = nv[util], out = origin[util];
    // console.log(`debug:replaceLNS new=${nv.a}[${ut.removed}];old=${origin.a}[${out.removed}]`);

    // ! 引入extraLns 来处理 赋值问题
    if (!out.extraLns || !out.extraLns.has(ut.lns)) {
        if (!ut.extraLns) {
            ut.extraLns = new Set([ out.lns ]);
        } else {
            ut.extraLns.add(out.lns);
        }
    } else {
        const n = ut.lns;
        ut.lns = out.lns;
        out.lns = n;
        out.extraLns.delete(n);
    }

    for (const k in nv) {
        // console.log(k);
        if (isProxy(nv[k]) && isProxy(origin[k])) {
            replaceLNS(nv[k], origin[k]);
        }
    }
}

export function addLns (lns, property, listener) {
    // console.log('add lns start');
    let set = lns[property];
    if (!set) set = lns[property] = new Set();
    if (!set.has(listener)) {
        // console.log('add lns true');
        // 移除被删除的dom的引用释放内存
        const cleaner = getCurCleaner();
        if (cleaner) {
            if (property === 'v') {
                cleaner.collect(() => {
                    set.delete(listener);
                    listener = null;
                });
            }
        }
        set.add(listener);
    }
}