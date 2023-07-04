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

export type IIfTarget = IWatchRefTarget<boolean>;
export interface IIfReturn {
    elif(data: IIfTarget, call: IReturnCall): IIfReturn;
    else(call: IReturnCall): IGeneralElement|void;
    end(): IGeneralElement|void;
}

export function _if (ref: IIfTarget, call: IReturnCall, util: ICtxUtil): IIfReturn {
    const calls: IReturnCall[] = [];
    const switchNode = (i: number) => {
        util.anchor.replaceContent(util.cache.get(calls[i]));
    };
    const onDataChange = (bs: boolean[]) => {
        console.log('onDataChange', bs);
        for (let i = 0; i < bs.length; i++) {
            if (bs[i]) return switchNode(i);
        }
    };
    let index = 0;
    let returnEle: ITrueElement|(typeof empty) = empty;
    const refs: IIfTarget[] = [];
    const acceptIf = (ref: IIfTarget, call: IReturnCall) => {
        const id = index ++;
        calls[id] = call;
        const ele = util.cache.call(call);
        refs[id] = ref;
        if (returnEle === empty) {
            const value = typeof ref === 'function' ? ref() : ref.value;
            if (value) returnEle = ele;
        }
    };
    acceptIf(ref, call);
    const result: IIfReturn = {
        elif (ref, call) {
            acceptIf(ref, call);
            return result;
        },
        else (call) {
            // else 永远为true
            acceptIf(() => true, call);
            return this.end();
        },
        end () {
            watch<boolean[]>(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            // @ts-ignore ! 回收refs内存
            // refs = null;
            return util.anchor.replaceContent(returnEle);
        }
    };
    return result;
}