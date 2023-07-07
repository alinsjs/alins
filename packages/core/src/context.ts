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
import {ITrueElement, Renderer} from './element/renderer';
import {createAnchor} from './scope/anchor';
import {createCallCache} from './scope/cache';
import {createBranchLink, IBranchTarget} from './scope/branch';

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
        dynamic (call: IAsyncReturnCall, isReturnEl = true) {
            // todo
            let target: IBranchTarget;
            call().then((res: ITrueElement|any) => {
                if (Renderer.isElement(res) && isReturnEl) {
                    if (target.isVisible()) {
                        anchor.replaceContent(res, target);
                    } else {
                        cache.modifyCache(call, res);
                    }
                }
            });
            if (isReturnEl) {
                target = branch.next(call as any, anchor, true);
                const cacheCall = () => Renderer.createEmptyMountNode();
                const res = cache.call(target, cacheCall) as ITrueElement;
                branch.back();
                // ! 首次不需要branch
                return anchor.replaceContent(res);
            }
        }
    };
    return ctx;
}

export type IComponentContext = ReturnType<typeof createContext>;