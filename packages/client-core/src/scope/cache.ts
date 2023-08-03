/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:42:17
 * @Description: Coding something
 */

import {transformAsyncDom} from '../element/element';
import {ITrueElement, IElement, ITextNode, Renderer, getFirstElement} from '../element/renderer';
import type {IAsyncReturnCall, IReturnCall} from '../type';
import type {IBranchTarget} from './branch';

// const DEFAULT_CACHE_KEY = createEmptyJson();

function transformElementToCache (element: ITrueElement|null): (IElement|ITextNode)[]|null {
    if (!element) return null;
    if (Renderer.isFragment(element)) {
        // @ts-ignore
        return Array.from(element.childNodes);
    }
    // @ts-ignore
    return [element];
}

function transformCacheToElement (cache: (IElement|ITextNode)[]|null): ITrueElement|null {
    if (!cache) return Renderer.createEmptyMountNode();
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
    // window.map = map;
    // 当前执行到的函数
    // const currentCall: IReturnCall|IAsyncReturnCall|null = null;

    return {
        // ! 调用某个函数，缓存其结果
        // @ts-ignore
        call (branch: IBranchTarget, anchor?: any) {
            // debugger;
            branch.visit();
            const fn = branch.call;
            const item = map.get(fn);
            // ! 需要更新自己与父branch的cache
            console.log('branch debug:item', branch.id, item);
            if (typeof item !== 'undefined') {
                debugger;
                branch.parent?.clearCache?.();
                return transformCacheToElement(item);
            }
            debugger;
            // currentCall = fn;
            const origin = fn();
            let element: any;
            if (fn.returned === false) {
                element = transformAsyncDom(origin, false);
            } else {
                let first: any = null;
                element = transformAsyncDom(origin, true, (trueDom: any) => {
                    // ! 被异步dom返回替换时需要替换cache和anchor
                    this.modifyCache(branch, trueDom);
                    anchor?.replaceStart(first, trueDom);
                    first = null;
                });
                first = getFirstElement(element);
            }
            // currentCall = null;
            // 有可能存在void的情况
            if (Renderer.isElement(element) || typeof element === 'undefined') {
                this.modifyCache(branch, element);
                return element;
            }
            // todo 对于 return; 的处理
            throw new Error('动态条件分支中不允许返回非元素类型');
        },
        modifyCache (branch: IBranchTarget, el: ITrueElement) {
            if (!branch.call) return;
            // if (el) {
            const doms = transformElementToCache(el);
            console.log('branch debug: cache call', branch.id, doms);
            map.set(branch.call, doms);
            // } else {
            //     branch.parent?.clearCache?.();
            // }
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
