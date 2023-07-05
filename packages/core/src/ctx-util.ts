/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-04 09:42:17
 * @Description: Coding something
 */


import {IFragment, ITextNode, ITrueElement, Renderer} from './element/renderer';
import {IElement} from './element/renderer';
import {IReturnCall} from './type';
/*
dom 元素挂载的锚点
firstElement => anchor 之前为组件的所有dom
*/

function getFirstElement (element?: ITrueElement) {
    if (!element) return null;
    // @ts-ignore
    return (Renderer.isFragment(element) ? (element.children[0]) : element);
}


export function createAnchor () {
    let end: IElement|null = null;
    let start: IElement|null = null;

    let frag: IFragment;

    const initFirstMount = (element?: ITrueElement): IFragment => {
        end = Renderer.createEmptyMountNode();
        start = getFirstElement(element) || end;

        if (Renderer.isFragment(element)) {
            // @ts-ignore
            element.appendChild(end);
            return element as IFragment;
        }
        const d = Renderer.createDocumentFragment();
        // @ts-ignore
        if (element) d.appendChild(element);
        // @ts-ignore
        d.appendChild(end);
        return d;
    };

    return {
        // 往当前组件替换dom元素
        replaceContent (element?: ITrueElement) {
            if (!end || !start) {
                frag = initFirstMount(element);
                return frag;
            }
            if (!element) return;
            const container = (end.parentElement || frag);
            if (container === element) return element;
            const cursor = start;
            if (cursor !== end) {
                while (cursor.nextSibling !== end) {
                    cursor.nextSibling.remove();
                }
                cursor.remove();
            }
            // @ts-ignore
            start = getFirstElement(element) || end;
            container.insertBefore(element, end);
            return element;
        }
    };
}

export type ICtxAnchor = ReturnType<typeof createAnchor>

// const DEFAULT_CACHE_KEY = createEmptyJson();

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
    // const currentCall: IReturnCall|IAsyncReturnCall|null = null;


    return {
        // ! 调用某个函数，缓存其结果
        // @ts-ignore
        call (branch: IBranchTarget, realGenerator?: IReturnCall) {
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
            throw new Error('动态条件分支中不允许返回非元素类型');
        },
        modifyCache (fn: IReturnCall, el: ITrueElement) {
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
        }
    };
}
export type ICallCache = ReturnType<typeof createCallCache>

export interface IBranchTarget {
    id: number;
    call: IReturnCall;
    parent: IBranchTarget|null;
    visit(): void;
    current(): IBranchTarget|null;
    isVisible(branch?: IBranchTarget|null): boolean;
}

export function createBranchLink (cache: ICallCache) {
    let stack: IBranchTarget[] = [];
    let id = 0;

    let currentBranch: IBranchTarget|null = null;

    let branchMap: WeakMap<IBranchTarget, 1>|null = null;

    const createTarget = (call: IReturnCall, isNext = false): IBranchTarget => {
        const last = stack.length === 0 ? null : stack[stack.length - 1];
        const parent = (isNext ? last?.parent : last) as IBranchTarget|null;
        return {
            id: id++,
            call,
            parent,
            current () {
                return currentBranch;
            },
            isVisible (branch?: IBranchTarget|null) {
                console.warn('isVisible', this);
                // 做一件事情：如果需要更新dom，则直接更新，否则清除祖先缓存
                debugger;
                if (branchMap === null) {
                    branchMap = new WeakMap();
                    let parent: IBranchTarget|null = branch || currentBranch; // todo fix 这里的上一个分支逻辑有问题
                    while (parent) {
                        branchMap.set(parent, 1);
                        parent = parent.parent;
                    }
                }
                const isCurrentVisible = !!branchMap.get(this);
                if (isCurrentVisible) {
                    console.warn('isVisible result true');
                    return true;
                }
                let parent = this.parent;
                if (!parent) return false;
                if (!!branchMap.get(parent)) return true;
                parent = parent.parent;
                while (parent) {
                    const isVisible = !!branchMap.get(parent);
                    if (isVisible) {
                        console.warn('isVisible result false1');
                        break;
                    }
                    cache.clearCache(parent.call); // 清除不可见分支的缓存
                    parent = parent.parent;
                }
                console.warn('isVisible result false2');
                return false;
            },
            visit () {
                // ! 访问某个分支之后 将该分支作为stack起点 作为还未加载节点的父分支
                stack = [this];
                console.warn('visit branch', this);
                if (currentBranch === this) return;
                currentBranch = this;
                branchMap = null;
            }
        };
    };

    return {
        next (call: IReturnCall, forward = false) {
            const target = createTarget(call, !forward);
            forward ? stack.push(target) : stack[stack.length - 1] = target;
            console.warn(`【target:${target.id}】`, target.call.toString());
            return target;
        },
        back () {
            return stack.pop();
        },
    };
}
export type IBranchLink = ReturnType<typeof createBranchLink>