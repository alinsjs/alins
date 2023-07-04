/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:42:17
 * @Description: Coding something
 */


import {IGeneralElement, ITextNode, ITrueElement, Renderer} from './element/renderer';
import {IElement} from './element/renderer';
import {IAsyncReturnCall, IReturnCall} from './type';
import {createEmptyJson} from './utils';
/*
dom 元素挂载的锚点
firstElement => anchor 之前为组件的所有dom
*/

function getFirstElement (element: ITrueElement) {
    // @ts-ignore
    return (Renderer.isFragment(element) ? element.children[0] : element) || null;
}


export function createAnchor () {
    let end: IElement|null = null;
    let start: IElement|null = null;

    const checkElement = (element: IGeneralElement) => {
        if (element === null) {
            start = end;
            return false;
        }
        return true;
    };

    const initFirstMount = (element: IGeneralElement) => {
        end = Renderer.createEmptyMountNode();
        if (!checkElement(element)) return end;
        start = getFirstElement(element);

        if (Renderer.isFragment(element)) {
            element.appendChild(end);
            return element;
        }
        const d = Renderer.createDocumentFragment();
        d.appendChild(element);
        d.appendChild(end);
        return d;
    };

    return {
        // 往当前组件替换dom元素
        replaceContent (element: IGeneralElement) {
            debugger;
            if (!end || !start) { // 初次使用
                return initFirstMount(element);
            }
            const cursor = start;
            if (cursor !== end) {
                while (cursor.nextSibling !== end) {
                    cursor.nextSibling.remove();
                }
                cursor.remove();
            }
            if (!checkElement(element)) return end;
            // @ts-ignore
            start = getFirstElement(element);
            end.parentElement.insertBefore(element, end);
            return element;
        }
    };
}

export type ICtxAnchor = ReturnType<typeof createAnchor>

const DEFAULT_CACHE_KEY = createEmptyJson();

function transformElementToCache (element: ITrueElement): (IElement|ITextNode)[] {
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
    const map = new WeakMap<IReturnCall|Object, (IElement|ITextNode)[]>();

    // 当前执行到的函数
    let currentCall: IReturnCall|IAsyncReturnCall|null = null;

    return {
        // ! 调用某个函数，缓存其结果
        // @ts-ignore
        call (fn: IReturnCall|IAsyncReturnCall, realGenerator: IReturnCall = fn) {
            currentCall = fn;
            const element = realGenerator();
            currentCall = null;
            // 有可能存在void的情况
            if (Renderer.isElement(element)) {
                map.set(fn, transformElementToCache(element));
                return element;
            }
            // throw new Error('动态条件分支中不允许返回非元素类型');
        },
        getCurrentCall () {
            return currentCall;
        },
        cacheDefault (el: ITrueElement) {
            map.set(DEFAULT_CACHE_KEY, transformElementToCache(el));
        },
        get (fn: IReturnCall): ITrueElement {
            const 
            return transformCacheToElement(map.get(fn));
        },
    };
}
export type ICallCache = ReturnType<typeof createCallCache>