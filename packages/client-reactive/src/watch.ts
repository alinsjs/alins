/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 15:31:14
 * @Description: Coding something
 */
import { IProxyListener, IProxyData, util, IRefData, trig, empty } from 'alins-utils';
import { isProxy, observe } from './proxy';
// import {computed} from './computed';
import { IOprationAction } from './array-proxy';

export type IWatchRefTarget<T> = (()=>T)|IRefData<T>|{v:T};
export type IWatchTarget<T> = IWatchRefTarget<T>|(IProxyData<T>);

export function watchRef<T> (
    target: IWatchRefTarget<T>,
    cb: IProxyListener<T>,
): IRefData<T>|{v:T} {
    return watch(target, cb, false) as any;
}

function isValueEqual (v1: any, v2: any, deep: boolean = true, first = true): boolean {
    if (v1 && v2 && typeof v1 === 'object' && typeof v2 === 'object' && (first || deep)) {
        if (Array.isArray(v1)) {
            if (v1.length !== v2.length) return false;
        } else {
            if (Object.keys(v1).length !== Object.keys(v2).length) return false;
        }
        for (const k in v1) {
            if (!isValueEqual(v1[k], v2[k], deep, false)) return false;
        }
        return true;
    } else {
        return v1 === v2;
    }
}

export function watch<T> (
    target: IWatchTarget<T>,
    cb: IProxyListener<T>,
    deep = true,
): IProxyData<T>|IRefData<T>|{v:T} {
    // console.warn('watch', target);
    if (typeof target === 'function') {
        let before: any = empty;
        before = observe(target, (v, nv, path, p, remove) => {
            // console.log('observe', v, nv, path);
            // ! 对于 UpdateExpression 直接用v作为新值 如果通过target会循环调用 (Maximum call stack size excee)
            // @ts-ignore
            // const after = target._update ? v : observe(target, fn);
            const after = target._update ? v : target();
            if (!isValueEqual(before, after)) {
                // console.log(after, before, path, p, remove);
                cb(after, before, path, p, remove);
                before = after;
            } else {
                return after;
            }
        });
        return { v: before };
    } else if (!isProxy(target)) {
        // ! 兼容computed(()=>1+1)情况
        return target;
    }
    // @ts-ignore
    if (target[util]) { // ! 没有 util 表示不是proxy
        // @ts-ignore
        target[util].subscribe(cb, deep);
    }
    return target;
};

export function watchArray (
    target: IProxyData<any[]>,
    listener: ({ index, count, data, type }: IOprationAction)=>void
) {
    // @ts-ignore
    if (!target[trig]) {
        // @ts-ignore
        target[trig] = [ listener ];
    } else {
        // @ts-ignore
        target[trig].push(listener);
    }
}

// window.watchArray = watchArray;