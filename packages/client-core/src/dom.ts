/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-03 11:29:19
 * @Description: Coding something
 */

import {IJson} from 'alins-utils';
import {IGeneralElement} from './element/renderer';

export function createDomCtx (element: IGeneralElement) {
    const updateCache: IJson<IGeneralElement> = {};
    const cache = (id: number, dom: any) => {
        updateCache[id] = dom;
    };
    const readCache = (id: number) => {
        return updateCache[id] || null;
    };

    let lastDom: IGeneralElement = null;

    const replaceDom = (dom: IGeneralElement) => {
        // todo
        lastDom = dom;
    };
    
    return {
        update (gen: ()=>IGeneralElement, id: number) {
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

export type ICreateDomCtx = typeof createDomCtx;
export type IDomCtx = ReturnType<ICreateDomCtx>;
