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
    anchor: ICtxAnchor;
    inited?: boolean;
}

export function createBranchLink (cache: ICallCache, anchor: ICtxAnchor) {
    let stack: IBranchTarget[] = [];
    let id = 0;
    const Root = {anchor, parent: null};

    let currentBranch: IBranchTarget|null = null;

    let branchMap: WeakMap<IBranchTarget, 1>|null = null;

    const createTarget = (call: IReturnCall, anchor: ICtxAnchor, forward = false): IBranchTarget => {
        const last = stack.length === 0 ? Root : stack[stack.length - 1];
        const parent = (forward ? last : last?.parent) as IBranchTarget|null;
        return {
            id: id++,
            call,
            parent,
            anchor,
            current () {
                return currentBranch;
            },
            isVisible (branch?: IBranchTarget|null) {
                // console.warn('isVisible', this);
                // 做一件事情：如果需要更新dom，则直接更新，否则清除祖先缓存
                // debugger;
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
                    // cache.clearCache(parent.call); // 清除不可见分支的缓存
                    parent = parent.parent;
                }
                // console.warn('isVisible result false2');
                return false;
            },
            visit () {
                // ! 访问某个分支之后 将该分支作为stack起点 作为还未加载节点的父分支
                stack = [this];
                // console.warn('visit branch', this);
                if (currentBranch === this) return;
                currentBranch = this;
                branchMap = null;
            }
        };
    };

    return {
        // forward 表示是否要向下一层
        next (call: IReturnCall, anchor: ICtxAnchor, forward = false) {
            const target = createTarget(call, anchor, forward);
            // debugger;
            forward ? stack.push(target) : stack[stack.length - 1] = target;
            // console.warn(`【target:${target.id}】`, target.call.toString());
            // if (!window.bs) window.bs = {};
            // window.bs[target.id] = target;
            return target;
        },
        back () {
            return stack.pop();
        },
    };
}
export type IBranchLink = ReturnType<typeof createBranchLink>