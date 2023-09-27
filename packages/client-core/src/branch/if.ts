/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 21:55:39
 * @Description: Coding something
 */
import { IWatchRefTarget, watch } from 'alins-reactive';
import { IGeneralElement, IReturnCall } from '../element/alins.d';
// import { Renderer } from '../element/renderer';
import { empty } from 'alins-utils';
import { BranchBlock } from './branch-block';

export type IIfTarget = IWatchRefTarget<boolean>;
export interface IIfReturn {
    elif(data: IIfTarget, call: IReturnCall): IIfReturn;
    else(call: IReturnCall): IIfReturn;
    end(call?: IReturnCall): IGeneralElement|void;
}

// const _ifCMMap = [] as any[];
// window._mm = _ifCMMap;
// const _anchorMap = [] as any[];
// window._am = _anchorMap;

class IfBlock implements IIfReturn {
    private branch: BranchBlock;

    private activeIndex = -1;

    constructor (ref: IIfTarget, call: IReturnCall) {
        this.branch = new BranchBlock();
        this.acceptIf(ref, call);
    }

    private switchNode (i: number, force?: boolean) {
        if (this.activeIndex === i) return true;
        this.activeIndex = i;
        const returned = this.branch.returned(i);
        if (typeof force === 'undefined') {
            // ! 针对 if 分支不返回值的情况处理，强制执行force逻辑
            force = !returned;
        }
        this.branch.replace(i, force);
        // console.warn('switch node', i);
        // ! 编译时注入的returned
        return returned;
    }

    private onDataChange (bs: boolean[]) {
        // console.warn('if onDataChange', bs);
        const n = bs.length;
        for (let i = 0; i < n; i++) {
            if (bs[i]) {
                let returned = this.switchNode(i);
                console.log('onDataChange', i, returned);
                // ! 没有返回值并且不是最后一个 执行end逻辑
                if (!returned && i !== n - 1) {
                    returned = this.switchNode(n - 1, true);
                    console.log('onDataChange switchend', i, returned);
                }
                return returned;
            }
        }
    }

    private index = 0;
    // private returnEle: ITrueElement|(typeof empty) = empty;
    private returnEle: any = empty;
    private matched = false;
    private refs: IIfTarget[] = [];
    private returnTrueEl = false;

    private acceptIf (ref: IIfTarget, call: IReturnCall, isEnd = false) {
        const currentIndex = this.index;
        const id = this.index ++;
        this.refs[id] = ref;
        this.branch.add(call);

        if (this.returnEle !== empty) return;

        if (!this.matched || isEnd) {
            const value = typeof ref === 'function' ? ref() : ref.v;
            if (value) {
                this.matched = true;
                if (!isEnd) this.activeIndex = currentIndex;
                const dom = this.branch.replace(id);
                if (this.branch.returned(call)) {
                    this.returnTrueEl = true;
                }
                this.returnEle = dom;
            }
        }
    }

    elif (ref: IIfTarget, call: IReturnCall) {
        this.acceptIf(ref, call);
        return this;
    }
    else (call: IReturnCall) {
        // else 永远为true
        this.acceptIf(() => true, call);
        return this;
    }
    // ! if判断会引起finally执行与否
    end (call = () => {}) {
        this.acceptIf(() => true, call, true);
        // console.warn('if end', refs);
        watch<boolean[]>(() => (
            this.refs.map(item => typeof item === 'function' ? item() : item.v)
        ), this.onDataChange.bind(this), false);
        this.branch.quit();
        // ! 首次不需要branch
        const returnEl = this.returnEle;
        if (!this.returnTrueEl) {
            // @ts-ignore
            this.branch.replaceDom(call());
        }
        // @ts-ignore
        this.returnEle = this.returnTrueEl = this.acceptIf = this.matched = null;
        return returnEl;
    }
}


export function _if (ref: IIfTarget, call: IReturnCall): IfBlock {
    return new IfBlock(ref, call);
}
