/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 18:41:35
 * @Description: Coding something
 */

import {react} from 'packages/reactive/src';
import {IIfTarget, _if} from './if';
import {computed} from 'alins-reactive';
import {ISwitchCaseList, ISwitchTarget, _switch} from './switch';
import {_for} from './for';
import {ICtxUtil, IReturnCall} from './type';
import {createDomCtx} from './dom';
// import {createAnchor, createBranchLink, createCallCache} from './ctx-util';
import {createAnchor} from './scope/anchor';
import {createCallCache} from './scope/cache';
import {createBranchLink} from './scope/branch';
import {util} from 'packages/utils/src';
import {JSX} from './element/element';


export function createContext (top = false) {
    const cache = createCallCache();
    const anchor = createAnchor(cache);

    const branch = createBranchLink(cache, anchor);

    const ctxUtil: ICtxUtil = {
        anchor,
        cache,
        branch,
        top,
    };

    const ctx = {
        util: ctxUtil,
        $: react,
        co: computed,
        if: (cond: IIfTarget, call: IReturnCall) => {
            return _if(cond, call, ctxUtil);
        },
        switch: (cond: ISwitchTarget, list: ISwitchCaseList) => _switch(cond, list, ctxUtil),
        for: _for,
        dom: createDomCtx,
        equal: (v1: any, v2: any) => {
            if (v1[util] && v2[util]) return v1[util] === v2[util];
            return v1 === v2;
        },
        ce: JSX.createElement,

        // ! 处理 async 代码没有返回值
        // asyncNotReturned
        anr (fn: any) {
            fn.returned = false;
            return fn;
        }
    };
    return ctx;
}

export type IComponentContext = ReturnType<typeof createContext>;