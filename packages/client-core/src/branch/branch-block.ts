
/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-04 22:12:56
 * @Description: Coding something
 */
import { Renderer } from '../element/renderer';
import { IReturnCall } from '../type';
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
            }
        },

        visit (branch: BranchBlock) {
            if (!initialized || currentBranch === branch) return;
            // ! 访问某个分支之后 将该分支作为stack起点 作为还未加载节点的父分支
            stack = [ branch ];
            currentBranch = branch;
        }
    };
})();
let id = 0;
export class BranchBlock {
    start = Renderer.createEmptyMountNode();
    end = Renderer.createEmptyMountNode();
    id = id++;
    cache: BranchCache;

    parent: BranchBlock|null = null;

    children: BranchBlock[] = []; // debug use

    branchCalls: IReturnCall[] = [];

    activeIndex: number = -1;

    refreshList: any[] = [];

    constructor () {
        this.cache = new BranchCache();
        this.start.__branch = this;
        BranchTree.next(this);
        if (!window.Root) window.Root = this;
    }

    private wrapAnchor (el: any) {
        const d = Renderer.createDocumentFragment();
        // @ts-ignore
        d.appendChild(this.start);
        if (el) d.appendChild(el);
        // @ts-ignore
        d.appendChild(this.end);
        return d;
    }

    add (call: IReturnCall) {
        this.branchCalls.push(call);
    }

    getCache (call: IReturnCall) {
        BranchTree.visit(this);
        return this.cache.get(call);
    }

    init (call: IReturnCall) {
        const dom = this.getCache(call);

        this.activeIndex = this.branchCalls.indexOf(call);

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
        if (i === this.activeIndex) return;
        const call = this.branchCalls[i];
        this.activeIndex = i;
        const result = this.getCache(call);

        this.refresh(result);
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