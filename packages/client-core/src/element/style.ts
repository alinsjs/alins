/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import {reactiveBindingEnable} from './dom-util';
import {IStyle} from './jsx';

export function parseStyle (
    dom: HTMLElement,
    value: IStyle | string | (()=>string)
): boolean {
    if (value === null || typeof value === 'undefined') return false;

    if (typeof value === 'function') {
        reactiveBindingEnable(value, (v: any, ov: any) => {
            if (typeof v === 'string') return dom.setAttribute('style', v);
            for (const k in v) dom.style[k] = v[k];
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    dom.style[k] = '';
        });
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