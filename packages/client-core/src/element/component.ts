/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-13 22:22:13
 * @Description: Coding something
 */

import { AlinsType, type } from 'alins-utils';
import { computed, isProxy } from 'alins-reactive';
import { getParent } from '../utils';
import { IAttributes, ITrueElement } from './alins.d';
import { appendChild, getFirstElement, Renderer } from './renderer';
import { CompLife } from './lifecycle';

export type IJSXComp = ((
    attributes: IAttributes|null, children: ITrueElement[]
) => ITrueElement|Promise<ITrueElement>)

export function renderComponent (
    comp: IJSXComp,
    attrs: IAttributes|null,
    children: any[],
) {
    const id = CompLife.enter();
    const lifes: any = {};
    let $mount: any = null;
    if (attrs) {
        for (const k in attrs) {
            const v = attrs[k];
            switch (k) {
                case '$mount': $mount = v; delete attrs[k]; break;
                case '$created':
                case '$appended':
                case '$mounted':
                case '$removed': lifes[k] = v; delete attrs[k]; break;
                default: {
                    if (!isProxy(v)) {
                        attrs[k] = { v, [type]: AlinsType.Ref }; // ! 模拟ref
                    } else {
                        attrs[k] = computed(() => v.v, true);
                    }
                }; break;
            }
        }
    }
    const dom = comp(attrs || {}, children);

    CompLife.fill(lifes, id, dom);

    const result = transformAsyncDom(dom, (realDom) => {
        const node = getFirstElement(realDom);
        for (const k in lifes) {
            const fn = lifes[k];
            k === '$created' ? fn(node) : (node[`__${k}`] = fn);
        }
    }) as any;

    if ($mount) {
        if (typeof $mount === 'string') $mount = Renderer.querySelector($mount);
        appendChild($mount, result);
    }
    return result;
}

function transformAsyncDom (
    dom: ITrueElement|Promise<ITrueElement>|null|void,
    onRealDom: (trueDom: any)=>void,
) {
    if (!dom) return dom;
    if (dom instanceof Promise) {
        // ! 此处是为了应对 元素没有立即append到dom上的情况
        const frag = Renderer.createFragment();
        const node = Renderer.createEmptyMountNode();
        frag.appendChild(node as any);
        dom.then((realDom: any) => {
            if (!Renderer.isElement(realDom)) return;
            const parent = getParent(node, frag);
            // ! 此处当async node被隐藏时 async执行完毕 此处会报错
            try {
                onRealDom?.(realDom);
                appendChild(parent, realDom, node);
            } catch (e) {
                console.log('node 已被隐藏');
            } finally {
                node.remove();
            }
        });
        return frag;
    }
    onRealDom?.(dom);
    return dom;
}
