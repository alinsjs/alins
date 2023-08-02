/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {IWatchRefTarget, watch} from 'alins-reactive';
import {ISimpleValue} from 'alins-utils';
import {IBranchTarget} from './scope/branch';
import {IGeneralElement, ITrueElement, Renderer} from './element/renderer';
import {ICtxUtil, IReturnCall} from './type';
import {createAnchor} from './scope/anchor';

// export const _break = Symbol('b');
// export const _default = Symbol('d');

export type ISwitchTarget = IWatchRefTarget<ISimpleValue>;

export interface ISwitchCase {
    value?: any;
    brk?: boolean;
    call?: ()=>any;
}

export type ISwitchCaseList = ISwitchCase[];

enum SwitchResult {
    Init = 0,
    Break,
    Return,
    Continue,
}

// ! 编译时 return; return null; => return <></>

export function _switch (target: ISwitchTarget, caseList: ISwitchCaseList, util: ICtxUtil) {

    const anchor = createAnchor(util.cache);
    let endCall: IReturnCall;

    let initilizing = true;

    const branchMap = new WeakMap<IReturnCall, IBranchTarget>();

    let result: SwitchResult = SwitchResult.Init;

    // let returnEl: any = null;

    const execSingle = ({call, brk}: ISwitchCase) => {
        if (call) {
            const branch = branchMap.get(call);
            if (!branch) throw new Error('empty branch');
            // if (!initilizing) debugger;
            const dom = initilizing ? util.cache.call(branch, anchor) : anchor.replaceBranch(branch);
            if (dom) {
                result = SwitchResult.Return;
                return dom;
            }
        }
        result = brk ? SwitchResult.Break : SwitchResult.Continue;
        return !!brk;
    };

    // window.branchMap = branchMap;
    const run = (value: any) => {
        // console.warn('switch run');
        let macthed: boolean = false;
        result = SwitchResult.Init;
        let el: boolean|ITrueElement|null|undefined = null;
        for (const item of caseList) {
            if (macthed) {
                if (el = execSingle(item)) break;
            } else {
                // 没有value表示为default
                if (item.value === value || !('value' in item)) { // 命中或走default
                    macthed = true;
                    if (el = execSingle(item)) break;
                }
            }
        }
        // @ts-ignore
        if (result !== SwitchResult.Return) { // 不是return;
            const branch = branchMap.get(endCall) as IBranchTarget;
            el = initilizing ? util.cache.call(branch, anchor) : anchor.replaceBranch(branch);
        }
        return el;
    };

    // ! 首次run初始化分支
    const initSwitchBranches = () => {
        let first = true;
        for (const item of caseList) {
            if (item.call) {
                branchMap.set(item.call, util.branch.next(item.call, anchor, first));
                if (first) first = false;
            }
        }
        branchMap.set(endCall, util.branch.next(endCall, anchor, first));
        util.branch.back();
    };

    return {
        end (call: IReturnCall = () => void 0): IGeneralElement|void {
            endCall = call;
            // console.warn('switch end');
            const init = watch(target, (value) => {
                // if (value === 3) debugger;
                run(value);
            });
            initSwitchBranches();
            const el = run(init.v);
            initilizing = false;
            if (Renderer.isElement(el)) return anchor.replaceContent(el as ITrueElement);
            // @ts-ignore
            return Renderer.createDocumentFragment();
        }
    };
}