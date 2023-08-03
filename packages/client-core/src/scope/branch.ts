/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-07 10:35:16
 * @Description: Coding something
 */
import {IReturnCall} from '../type';
import {ICtxAnchor} from './anchor';
import {ICallCache} from './cache';

export interface IBranchTarget {
    id: number;
    call: IReturnCall;
    parent: IBranchTarget|null; // null 表示root
    visit(): void;
    current(): IBranchTarget|null;
    isVisible(branch?: IBranchTarget|null): boolean;
    clearCache(): void;
    anchor: ICtxAnchor;
    inited?: boolean;
    activeChild: IBranchTarget|null;
    getBottomChild(): IBranchTarget;
}

export function createBranchLink (cache: ICallCache, anchor: ICtxAnchor) {
    console.log('createBranchLink');
    let stack: IBranchTarget[] = [];
    let id = 0;
    const Root = {anchor, parent: null};

    let currentBranch: IBranchTarget|null = null;

    window.getCurBranch = () => currentBranch;

    // const branchPool: WeakMap<IReturnCall, IBranchTarget> = new WeakMap();

    // ! 表示active branch到Root branch的路径， 用作判断某branch是否可见
    let branchMap: WeakMap<IBranchTarget, 1>|null = null;

    // branchLink 是否初始化完毕
    let initialized = false;

    const createTarget = (call: IReturnCall, anchor: ICtxAnchor, forward = false): IBranchTarget => {
        // const item = branchPool.get(call);stack
        // if (item) return item;
        const last = stack.length === 0 ? Root : stack[stack.length - 1];
        const parent = (forward ? last : last?.parent) as IBranchTarget|null;
        const branch: IBranchTarget = {
            id: id++,
            call,
            parent,
            activeChild: null,
            anchor,
            current () {
                return currentBranch;
            },
            isVisible (branch?: IBranchTarget|null) {
                // console.warn('isVisible', this);
                // 做一件事情：如果需要更新dom，则直接更新，否则清除祖先缓存
                // debugger;
                if (!branchMap) {
                    branchMap = new WeakMap();
                    let node: IBranchTarget|null = branch || currentBranch; // todo fix 这里的上一个分支逻辑有问题
                    const path:any = [];
                    while (node) {
                        path.push(node.id);
                        branchMap.set(node, 1);
                        node = node.parent;
                    }
                    console.log('branch debug:branchpath', path.toString());
                }
                /*
                    branchMap 为一条当前可见路径到顶层的路径
                    然后通过判断 this branch 的父节点是否位于这条路径上来判断 this branch是否可见
                */
                const isCurrentVisible = !!branchMap.get(this);
                if (isCurrentVisible) {
                    // console.warn('isVisible result true');
                    return true;
                }
                let parent = this.parent;
                // ! parent 表示当前为组件根branch，为可见（可操作）
                if (!parent || !!branchMap.get(parent)) return true;
                while (parent) {
                    const isVisible = !!branchMap.get(parent);
                    if (isVisible) {
                        // console.warn('isVisible result false1');
                        break;
                    }
                    // todo ! 是否需要
                    // debugger;
                    // cache.clearCache(parent.call); // 清除不可见分支的缓存
                    parent = parent.parent;
                }
                // console.warn('isVisible result false2');
                return false;
            },
            visit () {
                // ! 访问某个分支之后 将该分支作为stack起点 作为还未加载节点的父分支
                // console.warn('visit branch', this);
                if (currentBranch === this) return;
                if (initialized) {
                    stack = [this];
                }
                currentBranch = this;
                if (this.parent) this.parent.activeChild = this;
                branchMap = null;
            },
            clearCache () {
                // console.warn('branch debug:clearCache', this.id, this.call);
                // cache.clearCache(this.call);
                // this.parent?.clearCache?.();
            },
            getBottomChild () {
                let node = this;
                while (node.activeChild) node = node.activeChild;
                return node;
            }
        };
        // branchPool.set(call, branch);
        return branch;
    };


    return {
        // forward 表示是否要向下一层
        next (call: IReturnCall, anchor: ICtxAnchor, forward = false) {
            const target = createTarget(call, anchor, forward);
            forward ? stack.push(target) : (stack[stack.length - 1] = target);
            console.warn(`branch debug:next:${target.id}:${forward}`, target.call.toString());
            if (!window.bs) window.bs = [];
            window.bs.push(target);
            return target;
        },
        back () {
            console.warn(`branch:back`);
            
            const value = stack.pop();
            if (stack.length === 0) { // 当所有branch弹出 initializing 完成
                initialized = true;
            }
            return value;
        },
    };
}
export type IBranchLink = ReturnType<typeof createBranchLink>