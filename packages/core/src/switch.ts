/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {IWatchRefTarget, watch} from 'packages/reactive/src';
import {ISimpleValue} from 'packages/utils/src';
import {IBranchTarget} from './scope/branch';
import {ITrueElement, Renderer} from './element/renderer';
import {ICtxUtil, IReturnCall} from './type';
import {createAnchor} from './scope/anchor';

export const _break = Symbol('b');
export const _default = Symbol('d');

export type ISwitchTarget = IWatchRefTarget<ISimpleValue>;

export interface ISwitchCase {
    value?: any;
    brk?: boolean;
    call?: ()=>any;
}

export type ISwitchCaseList = ISwitchCase[];
export interface ISwitchReturn {
    end(): void;
}

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

    const branchMap = new WeakMap<IReturnCall, IBranchTarget>();

    let result: SwitchResult = SwitchResult.Init;

    // let returnEl: any = null;

    const execSingle = ({call, brk}: ISwitchCase) => {
        if (call) {
            const branch = branchMap.get(call);
            if (!branch) throw new Error('empty branch');
            const dom = anchor.replaceBranch(branch);
            if (dom) {
                result = SwitchResult.Return;
                return dom;
            }
        }
        result = brk ? SwitchResult.Break : SwitchResult.Continue;
        return !!brk;
    };


    const run = (value: any, isInit = false) => {
        console.warn('switch run');
        let macthed: boolean = false;
        result = SwitchResult.Init;
        let first = true;
        let el: boolean|ITrueElement|null|undefined = null;
        for (const item of caseList) {
            if (isInit && item.call) {
                // ! 首次run初始化分支
                debugger;
                branchMap.set(item.call, util.branch.next(item.call, anchor, first));
                if (first) first = false;
            }
            if (macthed) {
                if (el = execSingle(item)) break;
            } else {
                if (item.value === value || typeof item.value === 'undefined') { // 命中或走default
                    macthed = true;
                    if (el = execSingle(item)) break;
                }
            }
        }

        if (isInit) {
            branchMap.set(endCall, util.branch.next(endCall, anchor, !first));
            util.branch.back();
        }

        // @ts-ignore
        if (result !== SwitchResult.Return) { // 不是return;
            const branch = branchMap.get(endCall) as IBranchTarget;
            el = util.anchor.replaceBranch(branch);
        }
        return el;
    };

    return {
        end (call: IReturnCall): ITrueElement {
            endCall = call;
            console.warn('switch end');
            const init = watch(target, (value) => {
                run(value);
            });

            const el = run(init.value, true);
            if (Renderer.isElement(el)) return el as ITrueElement;
            // @ts-ignore
            return Renderer.createDocumentFragment();
        }
    };
}