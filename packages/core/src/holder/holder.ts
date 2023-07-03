/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 18:41:35
 * @Description: Coding something
 */

import {IWatchRefTarget, react} from 'packages/reactive/src';
import {IChildren} from '../dom-util';
import {IIfReturn, _if} from './if';
import {computed} from 'alins-reactive';
import {Renderer} from '../renderer';
import {IElement} from '../renderer';
import {IJson} from 'packages/utils/src';
import {_switch} from './switch';
import {_for} from './for';

function createAnchor () {
    let empty: any = null;
    let anchor: any = null;

    return {
        set (el: IElement|null) {
            if (!el) {
                if (!empty) empty = Renderer.createEmptyMountNode();
                anchor = empty;
            } else {
                anchor = el;
            }
        },
        get () {
            return anchor;
        }
    };
}

function isJSXDom (): boolean {

}

function createDomCache () {
    // ! call 和 dom 的cache
    const callCache = new WeakMap();

    return {
        call (call: ()=>any) {
            const dom = call();
            if (isJSXDom(dom)) {
                callCache.set(call, dom);
            }
        },
        getCall (call: ()=>any) {
            return callCache.get(call) || null;
        },
    };
}

export function createDomCtx () {
    const updateCache: IJson<IElement> = {};
    const cache = (id: number, dom: any) => {
        updateCache[id] = dom;
    };
    const readCache = (id: number) => {
        return updateCache[id] || null;
    };

    let lastDom: IElement|null = null;

    const replaceDom = (dom: IElement) => {
        // todo
        lastDom = dom;
    };
    
    return {
        update (gen: ()=>IElement, id: number) {
            let dom = readCache(id);
            if (!dom) {
                dom = gen();
                cache(id, dom);
            }
            if (lastDom) {
                replaceDom(dom);
            }
            lastDom = dom;
            return dom;
        },
        render () {
            return lastDom;
        }
    };
}


export function createContext (): IComponentContext {
    const anchor = createAnchor();
    const cache = createDomCache();

    const ctx = {anchor, cache};

    return {
        $: react,
        co: computed,
        if: (cond, call) => _if(cond, call, ctx),
        switch: _switch,
        for: _for,

        dom: createDomCtx,

        default (child: IChildren, id: number) {
            if (!child) {
                anchor.set(null);
            } else {
                // todo
            }
        },
        switch () {

        },
        for () {

        }
    };
}