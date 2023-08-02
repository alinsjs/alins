/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import {reactiveBindingEnable} from './dom-util';
import {IBaseAttributes} from './jsx';
 
export function parseAttributes (
    dom: HTMLElement,
    value: IBaseAttributes | string | (()=>string)
): boolean {
    if (value === null || typeof value === 'undefined') return false;

    if (typeof value === 'function') {
        reactiveBindingEnable(value, (v: any, ov: any) => {
            if (typeof v === 'string') {
                const r1 = v.matchAll(/(.*?)=(.*?)(&|$)/g);
                v = {};
                for (const item of r1)v[r1[1]] = r1[2];
                const r2 = ov.matchAll(/(.*?)=(.*?)(&|$)/g);
                ov = {};
                for (const item of r2) ov[r2[1]] = r2[2];
            }
            for (const k in v) dom.setAttribute(k, v[k]);
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    dom.removeAttribute(k);
        });
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
            reactiveBindingEnable(value[k], (v, ov) => {
                v === null ?
                    dom.removeAttribute(v) :
                    dom.setAttribute(k, v);
            });
        }
    } else {
        return false;
    }
    return true;
}