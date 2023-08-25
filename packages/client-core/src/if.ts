/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 21:55:39
 * @Description: Coding something
 */
import {IWatchRefTarget, watch, getCurCleaner, useCurCleaner} from 'alins-reactive';
import {
    IReturnCall, ICtxUtil
} from './type';
import {IGeneralElement, ITrueElement, Renderer} from './element/renderer';
import {empty} from 'alins-utils';
import {IBranchTarget} from './scope/branch';
import {createAnchor} from './scope/anchor';

export type IIfTarget = IWatchRefTarget<boolean>;
export interface IIfReturn {
    elif(data: IIfTarget, call: IReturnCall): IIfReturn;
    else(call: IReturnCall): IIfReturn;
    end(call?: IReturnCall): IGeneralElement|void;
}

export function _if (ref: IIfTarget, call: IReturnCall, util: ICtxUtil): IIfReturn {
    // console.log('branch debug:enter if', call.toString());
    const cleaner = getCurCleaner();
    const anchor = createAnchor(util.cache);
    // ! 最后一个branch是end
    const branchs: IBranchTarget[] = [];
    let activeIndex = -1;
    // console.log(branchs);

    // 返回当前接节点是否有返回值
    const switchNode = (i: number) => {
        if (activeIndex === i) return true;
        activeIndex = i;
        const branch = branchs[i];
        useCurCleaner(cleaner, () => {
            anchor.replaceBranch(branch);
        });
        // setCurCleaner(cleaner);
        // console.warn('switch node', i);
        // ! 编译时注入的returned
        return branch.call.returned !== false;
    };
    const onDataChange = (bs: boolean[]) => {
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
    let matched = false;
    const refs: IIfTarget[] = [];
    const acceptIf = (ref: IIfTarget, call: IReturnCall, init = false, isEnd = false) => {
        const currentIndex = index;
        const id = index ++;
        // console.warn('accept if', id);
        branchs[id] = util.branch.next(call, anchor, init);
        refs[id] = ref;

        if (returnEle !== empty) return;
        
        if (!matched || isEnd) {
            const value = typeof ref === 'function' ? ref() : ref.v;
            if (value) {
                matched = true;
                branchs[id].inited = true; // todo 待定
                if (!isEnd) activeIndex = currentIndex;
                const dom = util.cache.call(branchs[id], anchor);
                if (returnEle === empty && call.returned !== false) { // ! 编译时注入的returned
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
        },
        // ! if判断会引起finally执行与否
        end (call = () => {}) {
            acceptIf(() => true, call, false, true);
            // console.warn('if end', refs);
            debugger;
            watch<boolean[]>(() => (
                refs.map(item => typeof item === 'function' ? item() : item.v)
            ), onDataChange, false);
            util.branch.back();
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