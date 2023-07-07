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
import {IGeneralElement, ITrueElement, Renderer} from './element/renderer';
import {empty} from 'packages/utils/src';
import {IBranchTarget} from './scope/branch';
import {createAnchor} from './scope/anchor';

export type IIfTarget = IWatchRefTarget<boolean>;
export interface IIfReturn {
    elif(data: IIfTarget, call: IReturnCall): IIfReturn;
    else(call: IReturnCall): IGeneralElement|void;
    end(): IGeneralElement|void;
}

export function _if (ref: IIfTarget, call: IReturnCall, util: ICtxUtil): IIfReturn {
    const anchor = createAnchor(util.cache);
    const branchs: IBranchTarget[] = [];
    console.log(branchs);

    const switchNode = (i: number) => {
        const branch = branchs[i];
        debugger;
        const dom = anchor.replaceBranch(branch);
        console.warn('switch node', i, dom);
    };
    const onDataChange = (bs: boolean[]) => {
        console.warn('if onDataChange', bs);
        debugger;
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
        branchs[id] = util.branch.next(call, anchor, init);
        refs[id] = ref;
        if (returnEle === empty) {
            const value = typeof ref === 'function' ? ref() : ref.value;
            if (value) {
                const dom = util.cache.call(branchs[id]);
                if (dom) {
                    returnEle = dom;
                }
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
            util.branch.back();
            if (returnEle !== empty) {
                // ! 首次不需要branch
                return anchor.replaceContent(returnEle);
            }
            return Renderer.createDocumentFragment();
        }
    };
    return result;
}

// function aa () {
//     const data = await aa();
    
//     a.a = data;
    
//     return xxx;

//     return c.async(async () => {
//         const data = await aa();
//         a.a = data;
//         return xxx;
//     });
// }

// function aa () {
//     if (a === 1) {
//         const data = await aa();
//         a.a = data;
//     }

//     return xxx;

//     return c.if(a===1, ()=>{
//         const el = c.async(async () => {
//             const data = await aa();
//             a.a = data;
//             return xxx;
//         });
//         if(el) return el;
//     }).else(()={
//         return xxx;
//     })
// }