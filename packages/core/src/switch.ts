/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import {IWatchRefTarget, watch} from 'packages/reactive/src';
import {ISimpleValue} from 'packages/utils/src';
import {ITrueElement} from './element/renderer';
import {ICtxUtil, IReturnCall} from './type';

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

    let endCall: IReturnCall;

    let result: SwitchResult = SwitchResult.Init;

    const execSingle = ({call, brk}: ISwitchCase, returnEl?: (el?: ITrueElement)=>void) => {
        if (!call) {
            result = brk ? SwitchResult.Break : SwitchResult.Continue;
            return !!brk;
        }
        const dom = util.cache.call(call);
        if (dom) {
            const el = util.anchor.replaceContent(dom);
            if (returnEl) returnEl(el);
            result = SwitchResult.Return;
            return true;
        }
        result = brk ? SwitchResult.Break : SwitchResult.Continue;
        return !!brk;
    };

    const run = (value: any, returnEl?: (el?: ITrueElement)=>void) => {
        let macthed: boolean = false;
        result = SwitchResult.Init;
        for (const item of caseList) {
            if (macthed) {
                if (execSingle(item, returnEl)) break;
            } else {
                if (item.value === value || typeof item.value === 'undefined') { // 命中或走default
                    macthed = true;
                    if (execSingle(item, returnEl)) break;
                }
            }
        }
        // @ts-ignore
        if (result !== SwitchResult.Return) { // 不是return;
            const dom = util.cache.call(endCall);
            const el = util.anchor.replaceContent(dom);
            if (returnEl) returnEl(el);
        }
    };

    return {
        end (call: IReturnCall): ITrueElement {
            endCall = call;
            let returnEl: ITrueElement;
            run(watch(target, (value) => {
                run(value);
            }).value, el => {
                if (el) returnEl = el;
            });
            // @ts-ignore
            return returnEl;
        }
    };
}