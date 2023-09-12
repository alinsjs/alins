/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 09:09:46
 * @Description: Coding something
 */

import { IWatchRefTarget, watch } from 'alins-reactive';
import { ISimpleValue } from 'alins-utils';
import { Renderer } from '../element/renderer';
import { BranchBlock } from './branch-block';
import { IGeneralElement, IReturnCall } from '../element/alins.d';

// export const _break = Symbol('b');
// export const _default = Symbol('d');

export type ISwitchTarget = IWatchRefTarget<ISimpleValue>;

export type ISwitchCase = [any, (()=>any)|null, boolean];
// value, call, break,

export type ISwitchCaseList = ISwitchCase[];


// ! 编译时 return; return null; => return <></>

class SwitchBlock {
    private branch: BranchBlock;

    private endCall: IReturnCall;

    private target: ISwitchTarget;
    private caseList: ISwitchCaseList;

    constructor (target: ISwitchTarget, caseList: ISwitchCaseList) {
        this.branch = new BranchBlock();
        this.target = target;
        this.caseList = caseList;
    }

    private run (value: any) {
        // console.log('switch debug:run', value);
        let matched: boolean = false;
        let el: any = null;
        const n = this.caseList.length;
        for (let i = 0; i < n; i++) {
            const item = this.caseList[i];
            const caseValue = item[0];
            // 没有value表示为default
            if (
                (Array.isArray(caseValue) && caseValue.includes(value)) ||
                caseValue === value ||
                caseValue === null
            ) { // 命中或走default
                // console.log('matched');
                matched = true;
                el = this.branch.replace(i);
                break;
            }
        }
        if (!matched) {
            el = this.branch.replace(n);
        }
        return el;
    }

    end (call: IReturnCall = () => void 0): IGeneralElement|void {
        this.endCall = call;

        // ! 首次run初始化分支
        const initSwitchBranches = () => {
            for (const item of this.caseList) {
                const call = item[1];
                if (call) {
                    this.branch.add(call);
                }
            }
            this.branch.add(this.endCall);
            this.branch.quit();
        };

        // console.warn('switch end');
        const init = watch(this.target, (value) => {
            // console.warn('switch debug: change', value);
            this.run(value);
        });
        initSwitchBranches();
        const el = this.run(init.v);
        if (Renderer.isElement(el)) return el;
        // @ts-ignore
        return Renderer.createFragment();
    }
}

export function _switch (target: ISwitchTarget, caseList: ISwitchCaseList) {
    return new SwitchBlock(target, caseList);
}
