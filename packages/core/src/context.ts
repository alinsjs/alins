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
import {createAnchor, createCallCache} from './ctx-util';
import {ITrueElement, Renderer} from './element/renderer';


export function createContext () {
    const anchor = createAnchor();
    const cache = createCallCache();

    const util: ICtxUtil = {
        anchor,
        cache,
    };

    const ctx = {
        $: react,
        co: computed,
        if: (cond: IIfTarget, call: IReturnCall) => _if(cond, call, util),
        switch: (cond: ISwitchTarget, list: ISwitchCaseList) => _switch(cond, list, util),
        for: _for,
        dom: createDomCtx,
        // ! 处理 await 代码
        dynamic (call: IAsyncReturnCall, isReturnEl = true) {
            // todo
            call().then((res: ITrueElement|any) => {
                if (Renderer.isElement(res) && isReturnEl) {
                    util.anchor.replaceContent(res);
                }
            });
            if (isReturnEl) {
                const cacheCall = () => Renderer.createEmptyMountNode();
                const res = cache.call(call, cacheCall) as ITrueElement;
                return anchor.replaceContent(res);
            }
        }
    };
    return ctx;
}

export type IComponentContext = ReturnType<typeof createContext>;