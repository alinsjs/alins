/*
import { IWatchRefTarget } from 'packages/reactive/src/watch';
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 21:55:39
 * @Description: Coding something
 */
import {IWatchRefTarget, watch} from 'packages/reactive/src/watch';
import {
    IReturnCall, ICtxUtil
} from './type';
import {IGeneralElement, ITrueElement} from './element/renderer';
import {empty} from 'packages/utils/src';
import {IBranchTarget} from './ctx-util';

export type IIfTarget = IWatchRefTarget<boolean>;
export interface IIfReturn {
    elif(data: IIfTarget, call: IReturnCall): IIfReturn;
    else(call: IReturnCall): IGeneralElement|void;
    end(): IGeneralElement|void;
}

export function _if (ref: IIfTarget, call: IReturnCall, util: ICtxUtil): IIfReturn {
    const branchs: IBranchTarget[] = [];
    console.log(branchs);

    const switchNode = (i: number) => {
        const branch = branchs[i];
        const current = branch.current();
        const dom = util.cache.call(branch);
        if (branch.isVisible(current)) util.anchor.replaceContent(dom);
    };
    const onDataChange = (bs: boolean[]) => {
        console.warn('if onDataChange', bs);
        for (let i = 0; i < bs.length; i++) {
            if (bs[i]) return switchNode(i);
        }
    };
    let index = 0;
    let returnEle: ITrueElement|(typeof empty) = empty;
    const refs: IIfTarget[] = [];
    const acceptIf = (ref: IIfTarget, call: IReturnCall, init = false) => {
        const id = index ++;
        console.warn('accept if', id);
        branchs[id] = util.branch.next(call, init);
        refs[id] = ref;
        if (returnEle === empty) {
            const value = typeof ref === 'function' ? ref() : ref.value;
            if (value) {
                const dom = util.cache.call(branchs[id]);
                if (dom) returnEle = dom;
            }
        }
    };
    acceptIf(ref, call, true);
    const result: IIfReturn = {
        elif (ref, call) {
            acceptIf(ref, call);
            return result;
        },
        else (call) {
            // else 永远为true
            acceptIf(() => true, call);
            console.log('if else');
            return this.end();
        },
        end () {
            console.warn('if end', refs);
            watch<boolean[]>(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            // @ts-ignore ! 回收refs内存
            // refs = null;
            if (returnEle !== empty) {
                return util.anchor.replaceContent(returnEle);
            }
            util.branch.back();
            return null;
        }
    };
    return result;
}