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
import {arrayFuncProxy, replaceWholeArray} from './array-proxy';
import {replaceArrayItem} from './array-proxy';
import {empty, pureproxy} from 'alins-utils';
import {getCurCleaner} from './cleaner';

let currentFn: any = null;
let depReactive = false; // 当前表达式是否依赖响应数据

export function isDepReactive () {
    return depReactive;
}

export function observe (fn: ()=>any, listener: IProxyListener) {
    // if (__DEBUG__) console.log('Start observe', fn, listener);
    if (!listener) listener = fn;
    currentFn = listener;
    depReactive = false;
    const v = fn();
    currentFn = null;
    return v;
}

export function isRef (data: any): boolean {
    return data?.[type] === AlinsType.Ref;
}

export function isProxy (data: any): boolean {
    const t = data?.[type];
    return t === AlinsType.Proxy || t === AlinsType.Ref;
}

export function mockRef (data: any) {
    return {v: data, [type]: AlinsType.Ref};
}

export function wrapReactive (data: any, force = false) {
    if (force || !data || typeof data !== 'object') {
        // @ts-ignore
        return {v: data, [type]: AlinsType.Ref};
    }
    return data;
}

export function createUtils (
    data: IProxyData<object>,
    key: string,
    path: string[],
): void {
    const current = key ? [...path, key] : [...path];
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
    // const clearCache = () => {
    //     // @ts-ignore
    //     data[util].commonLns = null;
    //     const lns = data[util].lns;

    //     for (const k in lns) {
    //         lns[k].clear();
    //         // @ts-ignore
    //         lns[k] = null;
    //     }
    //     // @ts-ignore
    //     data[util].lns = null;
    //     // @ts-ignore
    //     data[util].extraLns = null;
    //     // @ts-ignore
    //     data[util] = null;
    // };
    const forceUpdate = () => {
        for (const k in data) {
            // @ts-ignore
            triggerChange(k, data[k], data[k]);
        }
    };
    const forceWrite = (v: any) => {
        for (const k in v) {
            // @ts-ignore
            triggerChange(k, v[k], data[k]);
        }
        Object.assign(data, v);
    };
    const subscribe = (ln: IProxyListener<any>, deep: boolean = true) => {
        // console.trace('subscribe', Object.keys(lns));
        data[util].commonLns?.add(ln) || (data[util].commonLns = new Set([ln]));
        for (const k in data) {
            data[util].lns[k]?.add(ln) || (data[util].lns[k] = new Set([ln]));
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
        // clearCache,
    });
}

function isArrayOrJson (o: any) {
    const data = o.constructor.name;
    if (data === 'Object' || data === 'Array') return true;
    return false;
}

export function createProxy<T extends IJson> (data: T, {
    commonLns,
    lns = {}, // lns=>listeners
    shallow = false,
    set,
    get,
    path = [],
    key = '',
}: {
    lns?: IProxyListenerMap;
    shallow?: boolean;
    get?: ()=>any,
    set?: IOnChange<any>|null;
    path?: string[];
    key?: string;
    commonLns?: Set<IProxyListener>
} = {}): IProxyData<T> {

    if (!isArrayOrJson(data)) {
        return data as any;
    }

    // @ts-ignore
    if (!data[type]) data[type] = AlinsType.Proxy;

    if (!shallow) {
        for (const k in data) {
            const v = data[k];
            if (v && typeof v === 'object') {
                try {
                    data[k] = createProxy(v, {path, key: k});
                } catch (e) {
                    // debugger;
                    console.warn(e);
                }
            }
        }
    }

    // @ts-ignore
    data[util] = {
        commonLns,
        lns,
        shallow,
        data,
    };
    // @ts-ignore
    createUtils(data, key, path);

    // @ts-ignore
    let {triggerChange, isArray} = data[util];

    let __clearCache = () => {
        data[util].clearCache();
        triggerChange = null;
        isArray = null;
        // @ts-ignore
        __clearCache = null;
        // @ts-ignore
        data[util] = null;
    };

    let prevLength = isArray ? data.length : null;

    // @ts-ignore
    const proxy = new Proxy(data, {
        // ! 闭包
        get (target: IJson, property, receiver) {
            if (property === '___clear_cache') {
                return __clearCache;
            }
            const isFunc = typeof target[property] === 'function';
            if (isArray && isFunc) {
                // console.log('Proxy function', property, target[property]);
                // debugger;
                return arrayFuncProxy(target, property as string, receiver);
            }
            if (typeof property !== 'symbol' && !isFunc) {
                // ! 收集依赖
                if (currentFn) {
                    if (!depReactive) depReactive = true;
                    if (!lns[property]) lns[property] = new Set();
                    let listener = currentFn;
                    if (!lns[property].has(listener)) {
                        // 移除被删除的dom的引用释放内存
                        const clean = () => {
                            // console.log('clear', target, property);
                            // debugger;
                            lns[property].delete(listener);
                            listener = null;
                        };
                        // console.log('collect', target[util], property);
                        // debugger;
                        getCurCleaner()?.collect(target[util], clean);
                        listener.__clear = clean;
                        // if (__DEBUG__) console.log('收集依赖', property);
                        lns[property].add(listener);
                        // if (__DEBUG__) console.log('收集依赖222', lns[property]);
                    }
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

            console.log('Set property', property, v);

            const orginSet = () => {
                console.log('aaa', v);
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
                // if (v.a === 2) debugger;
                let origin: any = null;
                if (isArray && property === 'length') {
                    origin = prevLength;
                    prevLength = data[property];
                } else {
                    origin =  target[property];
                }
                // debugger;
                if (v === origin && !target[util]?._map) return true;
                if (set === null) { console.warn('Computed 不可设置'); return true;}
                if (property === 'v' && set) { set(v, origin, `${path.join('.')}.${property as string}`, property); return true; }
                // if (v.a === 0) debugger;
                if (v && typeof v === 'object' && !shallow) { // ! 非shallow时 赋值需要createProxy并且将listener透传下去
                    if (!isProxy(v)) {
                        if (origin) origin[util].removed = true;
                        v = createProxy(v, {
                            commonLns: target[util].commonLns,
                            lns: origin?.[util].lns,
                            shallow,
                            path,
                            key: property as string,
                        });
                    } else {
                        if (!v[pureproxy]) v = v[util].proxy; // ! 如果是伪proxy 则获取真proxy
                        if (isProxy(origin) && data[util].replaceLns !== false) {
                            // todo 多个对象引用同一个数据时处理 !
                            // const list = target.filter(item => item[util] === v[util]);
                            // 需要修改lns
                            // console.warn('debug: replace lns', JSON.stringify(v), JSON.stringify(origin));
                            replaceLNS(v, origin);
                        }
                    }
                }

                let value: any = empty;


                if (isArray && /^\d+$/.test(property)) {
                    value = replaceArrayItem(target, property, v);
                }

                if (Array.isArray(v) && Array.isArray(origin)) {
                    value = replaceWholeArray(origin, v);
                }

                if (value === empty) value = orginSet();
                // ! 执行依赖
                // if (origin === undefined && property === '5') debugger;
                triggerChange(property as string, v, origin, false, typeof origin === 'undefined');
                return value;
            }
            return orginSet();
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
            ut.extraLns = new Set([out.lns]);
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