/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:42:17
 * @Description: Coding something
 */

import {transformAsyncDom} from '../element/element';
import {ITrueElement, IElement, ITextNode, Renderer, getFirstElement} from '../element/renderer';
import type {IReturnCall} from '../type';
import {getParent, insertBefore} from '../utils';
import type {IBranchTarget} from './branch';

// const DEFAULT_CACHE_KEY = createEmptyJson();

function transformElementToCache (element: ITrueElement|null|(IElement|ITextNode)[]): (IElement|ITextNode)[]|null {
    if (!element) return null;
    if (Renderer.isFragment(element)) {
        // @ts-ignore
        return Array.from(element.childNodes);
    } else if (Array.isArray(element)) {
        return element;
    }
    // @ts-ignore
    return [element];
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


export function createCallCache () {
    // ! call => dom 的cache
    const cacheMap = new WeakMap<IReturnCall|Object, (IElement|ITextNode)[]|null>();
    window.cacheMap = cacheMap;
    // 当前执行到的函数
    // const currentCall: IReturnCall|IAsyncReturnCall|null = null;
    
    let taskList: ((el: any, fn: any)=>void)[] = [];

    return {
        addCacheTask (fn) {
            taskList.push(fn);
        },
        // ! 调用某个函数，缓存其结果
        // @ts-ignore
        call (branch: IBranchTarget, anchor?: any) {
            branch.visit();
            const fn = branch.call;
            const item = cacheMap.get(fn);
            // ! 需要更新自己与父branch的cache
            // console.log('branch debug:item', branch.id, item);
            if (typeof item !== 'undefined') {
                const cacheElement = transformCacheToElement(item);

                if (taskList.length > 0) {
                    taskList.forEach(task => {
                        task(cacheElement, fn);
                    });
                    taskList = [];
                }
                return cacheElement;
            }
            curCache = this;
            // currentCall = fn;
            const origin = fn();
            curCache = null;
            let element: any;
            if (fn.returned === false) {
            // @ts-ignore
                element = transformAsyncDom(origin, false);
            } else {
                let first: any = null;
                // @ts-ignore
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
            // console.log('branch debug: cacheMap set', branch.id, doms);
            cacheMap.set(branch.call, doms);
            if (this.manager) {
                this.manager.cacheArray = doms;
            }
            // } else {
            //     branch.parent?.clearCache?.();
            // }
        },
        setCache (call: any, doms: any[]) {
            cacheMap.set(call, doms);
        },
        // getCurrentCall () {
        //     return currentCall;
        // },
        // cacheDefault (el: ITrueElement) {
        //     cacheMap.set(DEFAULT_CACHE_KEY, transformElementToCache(el));
        // },
        // clearCache (fn: IReturnCall) {
        //     cacheMap.delete(fn);
        // },
        _get (fn: any) {
            return cacheMap.get(fn);
        },
        manager: null as any as (ICacheManager|null),
    };
}
export type ICallCache = ReturnType<typeof createCallCache>

let curCache: ICallCache|null = null;

export function getCurCache () {
    return curCache;
}

export function createDomCacheManager () {
    const cache = curCache;

    const manager = {
        insertBefore (node: any, child:any, defParent: any) {
            // 如果没有父元素则 append到初始的frag上 // todo check 这里的逻辑
            const parent = getParent(child, defParent);
            if (!cache) {
                parent.insertBefore(node, child);
                return;
            }
            
            if (child.parentElement === parent) {
                insertBefore(this.cacheArray, node, child);
                parent.insertBefore(node, child);
            } else {
                cache?.addCacheTask((parent) => {
                    insertBefore(this.cacheArray, node, child);
                    try {
                        parent.insertBefore(node, child);
                    } catch (e) {
                        debugger;
                    }
                });
            }
        },
        removeElement (node: any) {

            if (!cache) {
                Renderer.removeElement(node);
                return;
            }

            if (node.parentElement) {
                Renderer.removeElement(node);
                const index = this.cacheArray.indexOf(node);
                this.cacheArray.splice(index, 1);
            } else {
                cache?.addCacheTask(() => {
                    Renderer.removeElement(node);
                    const index = this.cacheArray.indexOf(node);
                    this.cacheArray.splice(index, 1);
                });
            }
        },

        addTask (fn: any) {
            cache?.addCacheTask(fn);
        },
        cacheArray: [] as any[],
    };
    if (cache) cache.manager = manager;
    return manager;
}

type ICacheManager = ReturnType<typeof createDomCacheManager>;