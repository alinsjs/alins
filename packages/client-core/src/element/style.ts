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
    if (value === null || typeof value === 'undefined') return false;
    if (typeof value === 'function' || isProxy(value)) {
        reactiveBindingEnable(value, (v: any, ov: any, path, prop, remove) => {
            if (typeof v === 'string') {
                if (!prop || prop === 'v') {
                    dom.setAttribute('style', v);
                } else {
                    dom.style[prop] = !!remove ? '' : v;
                }
                return;
            }
            for (const k in v) dom.style[k] = v[k];
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    dom.style[k] = '';
        });
    // } else if(isProxy(value)){
    //     reactiveBindingEnable(value, (v,))
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
            reactiveBindingEnable(value[k], (v, ov) => {
                dom.style[k] = v === null ? '' : v;
            });
        }
    } else {
        return false;
    }
    return true;
}