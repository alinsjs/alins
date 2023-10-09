/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import { isProxy } from 'alins-reactive';
import { reactiveBindingEnable } from './dom-util';
import type { IElement } from './alins.d';

const SC = '_$single_class';

function setClass (dom: IElement, name: string, isRemove = false, single = false) {
    dom.classList[isRemove ? 'remove' : 'add'](name);

    if (single) {
        if (!dom[SC]) dom[SC] = new Set();
        dom[SC][isRemove ? 'delete' : 'add'](name);
    }
}

function replaceClass (dom: IElement, v: string) {
    dom.className = Array.from(new Set(v.split(' '))).join(' ');
    const sc = dom[SC];
    if (sc) sc.forEach((k: string) => {dom.classList.add(k);});
}

export function parseClassName (
    dom: IElement,
    value: {[prop in string]?: boolean} | string | (()=>string)
): boolean {

    if (value === null || typeof value === 'undefined') return false;
    if (typeof value === 'function' || isProxy(value)) {
        // @ts-ignore
        reactiveBindingEnable(value, (v: any, ov: any, path, prop, remove) => {
            if (typeof v === 'string') {
                replaceClass(dom, v);
                return;
            } else if (typeof v === 'boolean') {
                setClass(dom, prop, remove || v == false);
                return;
            }
            for (const k in v) {
                let value = v[k];
                if (typeof value === 'function') {
                    value = value();
                }
                setClass(dom, k, value == false);
            }
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    setClass(dom, k, true);
        });
    // } else if(isProxy(value)){
    //     reactiveBindingEnable(value, (v,))
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
            // @ts-ignore
            reactiveBindingEnable(value[k], (v) => {
                setClass(dom, k, !v);
            });
        }
    } else if (typeof value === 'string') {
        replaceClass(dom, value);
    }
    return true;
}

export function parseClassSuffix (el: IElement, key: string, value: boolean|(()=>boolean)): boolean {
    if (!key.startsWith('class$')) return false;
    const name = key.substring('class$'.length);
    reactiveBindingEnable(value, (v) => {
        setClass(el, name, !v, true);
    });
    return true;
}