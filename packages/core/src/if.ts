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
    else(call: IReturnCall): IIfReturn;
    end(call?: IReturnCall): IGeneralElement|void;
}

export function _if (ref: IIfTarget, call: IReturnCall, util: ICtxUtil): IIfReturn {
    const anchor = createAnchor(util.cache);
    // ! 最后一个branch是end
    const branchs: IBranchTarget[] = [];
    // console.log(branchs);

    // 返回当前接节点是否有返回值
    const switchNode = (i: number) => {
        const branch = branchs[i];
        debugger;
        anchor.replaceBranch(branch);
        // console.warn('switch node', i, dom);
        // ! 编译时注入的returned
        return branch.call.returned !== false;
    };
    const onDataChange = (bs: boolean[]) => {
        debugger;
        // console.warn('if onDataChange', bs);
        const n = bs.length;
        for (let i = 0; i < n; i++) {
            if (bs[i]) {
                let returned = switchNode(i);
                // ! 没有返回值并且不是最后一个 执行end逻辑
                if (!returned && i !== n - 1) {
                    returned = switchNode(n - 1);
                }
                return returned;
            }
        }
    };
    let index = 0;
    let returnEle: ITrueElement|(typeof empty) = empty;
    const refs: IIfTarget[] = [];
    const acceptIf = (ref: IIfTarget, call: IReturnCall, init = false) => {
        const id = index ++;
        // console.warn('accept if', id);
        branchs[id] = util.branch.next(call, anchor, init);
        refs[id] = ref;
        if (returnEle === empty) {
            const value = typeof ref === 'function' ? ref() : ref.value;
            if (value) {
                const dom = util.cache.call(branchs[id], anchor);
                if (call.returned !== false) { // ! 编译时注入的returned
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
            return result;
            // console.log('if else');
        },
        // ! if判断会引起finally执行与否
        end (call = () => {}) {
            // console.warn('if end', refs);
            watch<boolean[]>(() => (
                refs.map(item => typeof item === 'function' ? item() : item.value)
            ), onDataChange, false);
            // ! end 的 ref不需要监听
            acceptIf(() => true, call);
            // @ts-ignore ! 回收refs内存
            // refs = null;
            util.branch.back();
            console.log('asyncdebuf: if End', returnEle);
            if (returnEle !== empty) {
                // ! 首次不需要branch
                return anchor.replaceContent(returnEle);
            }
            // 创建一个空节点用来作为锚点
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