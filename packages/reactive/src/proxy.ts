/*
 * @Author: tackchen
 * @Date: 2022-10-13 07:33:15
 * @Description: Coding something
 */

import {
    AlinsType,
    IJson, IOnChange, IProxyData, IProxyListener, IProxyListenerMap,
    IProxyUtils,
    type, util
} from 'alins-utils';

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
        return {value: data, [type]: AlinsType.Ref};
    }
    data[type] = AlinsType.Proxy;
    return data;
}

export function createUtils (data: any, lns: IProxyListenerMap, path: string): IProxyUtils {
    const triggerChange = (property: string, nv: any, old: any = null, remove?: boolean) => {
        lns[property]?.forEach((fn) => fn(nv, old, `${path}.${property}`, property, remove));
    };
    const forceWrite = (v: any) => {
        for (const k in v)
            triggerChange(k, v[k], data[k]);
        Object.assign(data, v);
    };
    const subscribe = (ln: IProxyListener<any>, deep: boolean = true) => {
        // console.trace('subscribe', Object.keys(lns));
        for (const k in data) {
            lns[k]?.add(ln) || (lns[k] = new Set([ln]));
            if (deep && isProxy(data[k])) {
                data[k][util].subscribe(ln, deep);
            }
        }
    };
    return {
        lns,
        triggerChange,
        forceWrite,
        subscribe,
        isArray: Array.isArray(data),
    };
}

export function arrayProxy () {
    
}

export function createProxy<T extends IJson> (data: T, {
    lns = {}, // lns=>listeners
    shallow = false,
    set,
    get,
    path = '',
}: {
    lns?: IProxyListenerMap;
    shallow?: boolean;
    get?: ()=>any,
    set?: IOnChange<any>|null;
    path?: string;
} = {}): IProxyData<T> {

    if (!shallow) {
        for (const k in data) {
            const v = data[k];
            if (v && typeof v === 'object') {
                data[k] = createProxy(v);
            }
        }
    }

    // @ts-ignore
    const {
        triggerChange, isArray
    } = data[util] = createUtils(data, lns, path);

    return new Proxy(data, {
        get (target: IJson, property, receiver) {
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
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
                if (get) return get();
            }
            return Reflect.get(target, property, receiver);
        },
        set (target: IJson, property, v, receiver) {
            if (typeof property !== 'symbol' && typeof target[property] !== 'function') {
                console.log('Proxy.set', target, property, v);
                const origin = target[property];
                
                if (v === origina) return true;
                if (set === null) { console.warn('Computed 不可设置'); return true;}
                if (set) { set(v, origin, `${path}.${property as string}`, property); return true; }

                if (v && typeof v === 'object' && !shallow) { // ! 非shallow时 赋值需要createProxy并且将listener透传下去
                    v = createProxy(v, {lns: origin[util].lns, shallow, path: `${path}.${property as string}`});
                }
                const value = Reflect.set(target, property, v, receiver);
                // ! 执行依赖
                triggerChange(property as string, v, origin);
                return value;
            }
            return Reflect.set(target, property, v, receiver);
        },
        deleteProperty (target: IJson, property) {
            console.log('deleteProperty', target, property);
            triggerChange(property as string, undefined, target[property], true);
            return Reflect.deleteProperty(target, property);
        }
    }) as IProxyData<T>;
}

export function replaceProxy (nv: IProxyData<object>, origin: IProxyData<object>) {
    const nutil = nv[util];
    const outil = origin[util];
    outil.forceWrite(nv);

    for (const k in origin) {
        const type = typeof origin[k];
        if (type !== typeof nv[k]) continue;
        outil.lns[k].forEach(item => {
            nutil.lns[k].add(item);
        });
        if (typeof origin[k] === 'object') {
            replaceProxy(nv[k], origin[k]);
        }
    }
}