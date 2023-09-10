
/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-04 22:12:56
 * @Description: Coding something
 */
import { Renderer } from '../element/renderer';
import { IReturnCall } from '../type';
import { getParent, insertBefore } from '../utils';
import { BranchCache } from './cache';

const BranchTree = (() => {
    let initialized = false;
    let stack: BranchBlock[] = [];

    let currentBranch: BranchBlock|null = null;

    return {
        next (branch: BranchBlock) {
            branch.parent = currentBranch;
            currentBranch?.children.push(branch); // debug use
            stack.push(branch);
            currentBranch = branch;
        },
        back () {
            stack.pop();
            if (stack.length === 0) { // 当所有branch弹出 initializing 完成
                initialized = true;
                currentBranch = null;
            } else {
                currentBranch = stack[stack.length - 1];
            }
        },

        visit (branch: BranchBlock, call: any) {
            if (!initialized || currentBranch === branch) return call();
            // ! 访问某个分支之后 将该分支作为stack起点 作为还未加载节点的父分支
            stack = [ branch ];
            currentBranch = branch;
            const result = call();
            stack = [];
            currentBranch = null;
            return result;
        },
        current () {
            return currentBranch;
        }
    };
})();

// let id = 0;
export class BranchBlock {
    start = Renderer.createEmptyMountNode();
    end = Renderer.createEmptyMountNode();
    // id = id++;
    cache: BranchCache;

    parent: BranchBlock|null = null;

    children: BranchBlock[] = []; // debug use

    branchCalls: IReturnCall[] = [];

    activeIndex: number = -1;

    refreshList: any[] = [];

    private initilized = false;

    constructor () {
        this.cache = new BranchCache();
        // this.start.__branch = this; // todo 删除到这个地方的时候需要缓存一下
        BranchTree.next(this);
        // if (!window.Root) window.Root = this;
    }

    private wrapAnchor (el: any) {
        const d = Renderer.createFragment();
        // @ts-ignore
        d.appendChild(this.start);
        if (el) d.appendChild(el);
        // @ts-ignore
        d.appendChild(this.end);
        return d;
    }

    add (call: IReturnCall) {
        // console.warn('add', this.end);
        this.branchCalls.push(call);
    }

    getCache (call: IReturnCall) {
        // console.warn('getCache', this.end);
        return BranchTree.visit(this, () => this.cache.get(call));
    }

    private initAnchor (dom: any) {

        if (Renderer.isFragment(dom)) {
            // @ts-ignore
            dom.appendChild(this.end);
            // @ts-ignore
            dom.insertBefore(this.start, dom.childNodes[0]);
            return dom;
        } else {
            return this.wrapAnchor(dom);
        }
    }

    replace (i: number) {
        // console.warn('replace i', this.end);
        if (i === this.activeIndex) return;
        const call = this.branchCalls[i];
        this.activeIndex = i;
        const result = this.getCache(call);

        if (!this.initilized) {
            this.initilized = true;
            return this.initAnchor(result);
        } else {
            this.refresh(result);
            return result;
        }
    }

    refresh (result: any) {
        if (this.clear()) {
            if (Renderer.isElement(result)) {
                // @ts-ignore
                this.end.parentElement?.insertBefore(result, this.end);
            }
            this.parent?.refreshCache(this);
            this.triggerRefresh();
        } else {
            // ! 对于不在dom树的元素 需要加入待刷新队列 后续刷新
            this.parent?.addRefreshCall(this.refresh.bind(this, result));
        }
    }

    addRefreshCall (fn: any) {
        if (!this.start.parentElement) {
            this.parent?.addRefreshCall(fn);
        } else {
            this.refreshList.push(fn);
        }
    }

    triggerRefresh () {
        if (this.refreshList.length) {
            const arr = this.refreshList;
            this.refreshList = []; // ! 需要先清空后调用
            arr.forEach(fn => {fn();});
        } else {
            this.parent?.triggerRefresh();
        }
    }

    quit () {
        BranchTree.back();
    }

    returned (call: number|IReturnCall) {
        if (typeof call === 'number') {
            call = this.branchCalls[call];
        }
        // ! 编译时注入的returned
        return call.returned !== false;
    }

    refreshCache (child: BranchBlock) {
        this.cache.refreshCache(child.start, child.end);
        this.parent?.refreshCache(this);
    }

    private clear () {
        const { start, end } = this;
        if (!end.parentElement) return false;
        while (start.nextSibling && start.nextSibling !== end) {
            start.nextSibling.remove();
        }
        return true;
    }
}

export function createDomCacheManager () {
    const branch = BranchTree.current();

    return {
        insertBefore (node: any, child:any, defParent: any) {
            // 如果没有父元素则 append到初始的frag上
            const parent = getParent(child, defParent);
            if (!branch) {
                parent.insertBefore(node, child);
                return;
            }

            const cache = branch.cache;
            if (child.parentElement === parent) {
                insertBefore(cache.curCache, node, child);
                parent.insertBefore(node, child);
            } else {
                cache.addTask((parent) => {
                    // @ts-ignore
                    insertBefore(cache.curCache, node, child);
                    try {
                        parent.insertBefore(node, child);
                    } catch (e) {
                        // debugger;
                        console.warn(e);
                    }
                });
            }
        },
        removeElement (node: any) {
            if (!branch) {
                node.remove();
                return;
            }
            const cache = branch.cache;
            if (node.parentElement) {
                node.remove();
                const index = cache.curCache.indexOf(node);
                cache.curCache.splice(index, 1);
            } else {
                cache.addTask(() => {
                    node.remove();
                    const index = cache.curCache.indexOf(node);
                    cache.curCache.splice(index, 1);
                });
            }
        },

        addTask (fn: any) {
            branch?.cache.addTask(fn);
        },
    };
}