/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 18:41:35
 * @Description: Coding something
 */

// import {IIfTarget, _if} from './if';
import { IIfTarget, _if } from './branch/if';
import { assignCompData, assignData, computed, isProxy, mockRef, reactive, watch } from 'alins-reactive';
import { ISwitchCaseList, ISwitchTarget, _switch } from './switch';
import './for';
import { ICtxUtil, IReturnCall } from './type';
// import {createAnchor, createBranchLink, createCallCache} from './ctx-util';
import { createAnchor } from './scope/anchor';
import { createCallCache } from './scope/cache';
import { createBranchLink } from './scope/branch';
import { JSX } from './element/element';
import { mockMap } from './for';

export function createContext () {
    const cache = createCallCache();
    const anchor = createAnchor(cache);

    const branch = createBranchLink(cache, anchor);

    const ctxUtil: ICtxUtil = {
        anchor,
        cache,
        branch,
    };

    const ctx = {
        util: ctxUtil,
        // if: (cond: IIfTarget, call: IReturnCall) => {
        //     return _if(cond, call, ctxUtil);
        // },
        if: (cond: IIfTarget, call: IReturnCall) => {
            return _if(cond, call);
        },
        switch: (cond: ISwitchTarget, list: ISwitchCaseList) => _switch(cond, list, ctxUtil),
    };
    return ctx;
}

export const ContextTool = {
    ce: JSX.createElement,
    // ! 处理 async 代码没有返回值
    // markNotReturned
    mnr (fn: any) {
        fn.returned = false;
        return fn;
    },
    r (v: any, shallow?: boolean) {
        if (typeof shallow !== 'boolean') {
            shallow = typeof v.v === 'object' && isProxy(v.v);
        }
        return reactive({ v }, shallow);
    },
    c: computed,
    w: watch,
    cc (get: any, set: any) { // 简写，减少编译代码量
        return computed({ get, set });
    },
    e: assignData,
    es: assignCompData,
    // markUpdateExpression: true
    mu (fn:any) {
        fn._update = true;
        return fn;
    },
    mf: mockRef,
    mm: mockMap,
};

Object.assign(createContext, ContextTool);

export type IComponentContext = ReturnType<typeof createContext>;