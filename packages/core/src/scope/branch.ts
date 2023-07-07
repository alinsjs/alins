import {IReturnCall} from '../type';
import {ICallCache} from './cache';

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
                    console.warn('isVisible result true');
                    return true;
                }
                let parent = this.parent;
                // ! parent 表示当前为组件根branch，为可见（可操作）
                if (!parent || !!branchMap.get(parent)) return true;
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