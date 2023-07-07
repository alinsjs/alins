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
import {IAsyncReturnCall, ICtxUtil, IReturnCall} from './type';
import {createDomCtx} from './dom';
// import {createAnchor, createBranchLink, createCallCache} from './ctx-util';
import {createAnchor} from './scope/anchor';
import {createCallCache} from './scope/cache';
import {createBranchLink} from './scope/branch';
import {createAsyncScope} from './scope/async';

export function createContext () {
    const cache = createCallCache();
    const anchor = createAnchor(cache);

    const branch = createBranchLink(cache, anchor);

    const util: ICtxUtil = {
        anchor,
        cache,
        branch,
    };

    const ctx = {
        util,
        $: react,
        co: computed,
        if: (cond: IIfTarget, call: IReturnCall) => {
            return _if(cond, call, util);
        },
        switch: (cond: ISwitchTarget, list: ISwitchCaseList) => _switch(cond, list, util),
        for: _for,
        dom: createDomCtx,
        // ! 处理 await 代码
        // isReturnEl 表示 await 语句块中是否有return语句
        async: (call: IAsyncReturnCall, isReturnEl = true) => createAsyncScope(call, isReturnEl, util)
    };
    return ctx;
}

export type IComponentContext = ReturnType<typeof createContext>;