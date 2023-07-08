/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:42:17
 * @Description: Coding something
 */

import {ITrueElement, IElement, ITextNode, Renderer} from '../element/renderer';
import {IAsyncReturnCall, IReturnCall} from '../type';
import {IBranchTarget} from './branch';

// const DEFAULT_CACHE_KEY = createEmptyJson();

function transformElementToCache (element: ITrueElement|null): (IElement|ITextNode)[]|null {
    if (!element) return null;
    if (Renderer.isFragment(element)) {
        // @ts-ignore
        return Array.from(element.children);
    }
    // @ts-ignore
    return [element];
}

function transformCacheToElement (cache: (IElement|ITextNode)[]): ITrueElement {
    if (cache.length === 1) return cache[0];
    const d = Renderer.createDocumentFragment();
    for (const item of cache) {
        // @ts-ignore
        d.appendChild(item);
    }
    return d;
}

export function createCallCache () {
    // ! call => dom 的cache
    const map = new WeakMap<IReturnCall|Object, (IElement|ITextNode)[]|null>();
    window.map = map;
    // 当前执行到的函数
    // const currentCall: IReturnCall|IAsyncReturnCall|null = null;


    return {
        // ! 调用某个函数，缓存其结果
        // @ts-ignore
        call (branch: IBranchTarget, realGenerator?: IReturnCall) {
            // debugger;
            branch.visit();
            const fn = branch.call;
            const item = map.get(fn);
            if (!realGenerator) realGenerator = fn;
            if (item) return transformCacheToElement(item);
            // currentCall = fn;
            const element = realGenerator();
            // currentCall = null;
            if (typeof element === 'undefined') return;
            // 有可能存在void的情况
            if (Renderer.isElement(element)) {
                map.set(fn, transformElementToCache(element));
                return element;
            }
            // todo 对于 return; 的处理
            // throw new Error('动态条件分支中不允许返回非元素类型');
        },
        modifyCache (fn: IReturnCall|IAsyncReturnCall, el: ITrueElement) {
            map.set(fn, transformElementToCache(el));
        },
        // getCurrentCall () {
        //     return currentCall;
        // },
        // cacheDefault (el: ITrueElement) {
        //     map.set(DEFAULT_CACHE_KEY, transformElementToCache(el));
        // },
        clearCache (fn: IReturnCall) {
            map.delete(fn);
        },
        _get (fn: any) {
            return map.get(fn);
        }
    };
}
export type ICallCache = ReturnType<typeof createCallCache>
