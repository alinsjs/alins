/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import {isProxy} from 'alins-reactive';
import {reactiveBindingEnable} from './dom-util';
import {IStyle} from './jsx';

export function parseStyle (
    dom: HTMLElement,
    value: IStyle | string | (()=>string)
): boolean {
    debugger;
    if (value === null || typeof value === 'undefined') return false;
    if (typeof value === 'function' || isProxy(value)) {
        const isFunc = typeof value === 'function';
        // @ts-ignore
        reactiveBindingEnable(value, (v: any, ov: any, path, prop, remove) => {
            console.log(v, ov, path, prop, isFunc, isProxy(value));
            if (typeof v === 'string') {
                if (isFunc) {
                // if (!prop || prop === 'v') {
                    dom.setAttribute('style', v);
                } else {
                    dom.style[prop] = !!remove ? '' : v;
                }
                return;
            }
            for (const k in v) {
                let value = v[k];
                if (typeof value === 'function') {
                    value = value();
                }
                dom.style[k] = value;
            }
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    dom.style[k] = '';
        });
    // } else if(isProxy(value)){
    //     reactiveBindingEnable(value, (v,))
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
        // @ts-ignore
            reactiveBindingEnable(value[k], (v) => {
                dom.style[k] = v === null ? '' : v;
            });
        }
    } else {
        return false;
    }
    return true;
}

export function parseStyleSuffix (el: HTMLElement, key: string, value: any|(()=>any)): boolean {
    if (!key.startsWith('style$')) return false;
    const name = key.substring('style$'.length);
    reactiveBindingEnable(value, (v) => {
        el.style[name] = v === null ? '' : v;
    });
    return true;
}