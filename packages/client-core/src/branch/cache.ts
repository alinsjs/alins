/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-04 22:14:25
 * @Description: Coding something
 */

import { IElement, ITextNode, ITrueElement, Renderer } from '../element/renderer';
import { IReturnCall } from '../type';

function transformElementToCache (element: any): (IElement|ITextNode)[]|null {
    if (!element) return null;
    if (Renderer.isFragment(element)) {
        // @ts-ignore
        return Array.from(element.childNodes);
    } else if (Array.isArray(element)) {
        return element;
    }
    // @ts-ignore
    return [ element ];
}

function transformCacheToElement (cache: (IElement|ITextNode)[]|null): ITrueElement|null {
    if (!cache) return null;
    if (cache.length === 1) return cache[0];
    const d = Renderer.createDocumentFragment();
    for (const item of cache) {
        // @ts-ignore
        d.appendChild(item);
    }
    return d;
}

export class BranchCache {
    cacheMap = new WeakMap<IReturnCall, any[]|null>();

    // 当前的缓存数组
    curCache: any[]|null = [];

    get (call: IReturnCall) {
        const el = this.cacheMap.get(call);
        if (typeof el === 'undefined') {
            let result = call();
            if (typeof result === 'string') {
                result = Renderer.createTextNode(result);
            }
            this.curCache = transformElementToCache(result);
            this.cacheMap.set(call, this.curCache);
            return result;
        } else {
            this.curCache = el;
            return transformCacheToElement(el);
        }
    }

    refreshCache (start: IElement, end: IElement) {
        if (!this.curCache) throw new Error('CurCache is null');
        // this.cu
        const parent = start.parentElement;
        if (!parent) return;
        const children = parent.childNodes;
        const n = children.length;

        let started = false;

        const nodes: any[] = [];

        for (let i = 0; i < n; i++) {
            const node = children[i];
            if (started) {
                if (node === end) break;
                nodes.push(node);
            }
            if (node === start) {
                started = true;
            }
        }

        let index1 = -1, index2 = -1;

        const cn = this.curCache.length;

        for (let i = 0; i < cn; i++) {
            const node = this.curCache[i];
            if (node === start) index1 = i;
            else if (node === end) {
                index2 = i;
                break;
            }
        }
        this.curCache.splice(index1 + 1, index2 - index1 - 1, ...nodes);
    }
}