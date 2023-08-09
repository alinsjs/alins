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
import {arrayFuncProxy} from './array-proxy';
import {replaceArrayItem} from './array-proxy';
import {empty, pureproxy} from 'alins-utils';

let currentFn: any = null;
let depReactive = false; // 当前表达式是否依赖响应数据

export function isDepReactive () {
    return depReactive;
}

export function observe (fn: ()=>any, listener: IProxyListener = fn) {
    // if (__DEBUG__) console.log('Start observe', fn, listener);
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
        const each = (fn: any) => {fn(nv, old, `${current.join('.')}.${property}`, property, remove);};
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
    });
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

    // @ts-ignore
    if (!data[type]) data[type] = AlinsType.Proxy;

    if (!shallow) {
        for (const k in data) {
            const v = data[k];
            if (v && typeof v === 'object') {
                try {
                    data[k] = createProxy(v, {path, key: k});
                } catch (e) {
                    debugger;
                }
            }
        }
    }

    // @ts-ignore
    data[util] = {
        commonLns,
        lns,
        shallow,
    };
    // @ts-ignore
    createUtils(data, key, path);

    // @ts-ignore
    const {triggerChange, isArray} = data[util];

    // @ts-ignore
    const proxy = new Proxy(data, {
        get (target: IJson, property, receiver) {
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
                    // if (__DEBUG__) console.log('收集依赖', property);
                    lns[property]?.add(currentFn) || (lns[property] = new Set([currentFn]));
                    // if (__DEBUG__) console.log('收集依赖222', lns[property]);
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
        set (target: IJson, property, v, receiver) {
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
                // console.log('debug:Proxy.set', target, property, v);
                // if (v.a === 2) debugger;
                const origin = target[property];
                if (v === origin && !target[util]?._map) return true;
                if (set === null) { console.warn('Computed 不可设置'); return true;}
                if (property === 'v' && set) { set(v, origin, `${path.join('.')}.${property as string}`, property); return true; }
                // if (v.a === 0) debugger;
                if (v && typeof v === 'object' && !shallow) { // ! 非shallow时 赋值需要createProxy并且将listener透传下去
                    // debugger;
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
                    const data = replaceArrayItem(target, property, v);
                    if (data !== empty) value = data;
                }
                if (value === empty) value = Reflect.set(target, property, v, receiver);
                // ! 执行依赖
                // if (origin === undefined && property === '5') debugger;
                triggerChange(property as string, v, origin, false, typeof origin === 'undefined');
                return value;
            }
            return Reflect.set(target, property, v, receiver);
        },
        deleteProperty (target: IJson, property) {
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
    // debugger;
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