/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import { isProxy } from 'alins-reactive';
import { reactiveBindingEnable } from './dom-util';
import type { IStyle } from './jsx';
import type { IElement } from './renderer';

export const OnlyNumberMap = { 'zIndex': 1, 'opacity': 1, 'flex': 1, 'flexGrow': 1, 'flexShrink': 1 };

function setStyle (dom: IElement, prop: string, v: any, remove?: boolean) {
    if (typeof v === 'number' && !OnlyNumberMap[prop]) {
        v = `${v}px`;
    }
    dom.style[prop] = !!remove ? '' : v;
}

export function parseStyle (
    dom: IElement,
    value: IStyle | string | (()=>string)
): boolean {
    if (value === null || typeof value === 'undefined') return false;
    if (typeof value === 'function' || isProxy(value)) {
        const isFunc = typeof value === 'function';
        // @ts-ignore
        reactiveBindingEnable(value, (v: any, ov: any, path, prop, remove) => {
            if (typeof v === 'string') {
                if (isFunc) {
                // if (!prop || prop === 'v') {
                    dom.setAttribute('style', v);
                } else {
                    setStyle(dom, prop, v, remove);
                }
                return;
            }
            for (const k in v) {
                let value = v[k];
                if (typeof value === 'function') {
                    value = value();
                }
                setStyle(dom, k, value);
            }
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    setStyle(dom, k, '');
        });
    // } else if(isProxy(value)){
    //     reactiveBindingEnable(value, (v,))
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
        // @ts-ignore
            reactiveBindingEnable(value[k], (v) => {
                setStyle(dom, k, v, v === null);
            });
        }
    } else {
        return false;
    }
    return true;
}

export function parseStyleSuffix (el: IElement, key: string, value: any|(()=>any)): boolean {
    if (!key.startsWith('style$')) return false;
    const name = key.substring('style$'.length);
    reactiveBindingEnable(value, (v) => {
        setStyle(el, name, v, v === null);
    });
    return true;
}