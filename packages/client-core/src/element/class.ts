/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import { isProxy } from 'alins-reactive';
import { reactiveBindingEnable } from './dom-util';
import type { IElement } from './renderer';

export function parseClassName (
    dom: IElement,
    value: {[prop in string]?: boolean} | string | (()=>string)
): boolean {

    if (value === null || typeof value === 'undefined') return false;
    if (typeof value === 'function' || isProxy(value)) {
        // @ts-ignore
        reactiveBindingEnable(value, (v: any, ov: any, path, prop, remove) => {
            if (typeof v === 'string') {
                dom.className = v;
                return;
            } else if (typeof v === 'boolean') {
                dom.classList[(remove || v == false) ? 'remove' : 'add'](prop);
                return;
            }
            for (const k in v) {
                let value = v[k];
                if (typeof value === 'function') {
                    value = value();
                }
                dom.classList[(value === false) ? 'remove' : 'add'](k);
            }
            for (const k in ov)
                if (typeof v[k] === 'undefined')
                    dom.classList.remove(k);
        });
    // } else if(isProxy(value)){
    //     reactiveBindingEnable(value, (v,))
    } else if (typeof value === 'object') {
        for (const k in value) {
            // !todo style value 编译 + func包裹 ()=>{}
            // @ts-ignore
            reactiveBindingEnable(value[k], (v) => {
                dom.classList[v ? 'add' : 'remove'](k);
            });
        }
    } else if (typeof value === 'string') {
        dom.className = value;
    }
    return true;
}

export function parseClassSuffix (el: IElement, key: string, value: boolean|(()=>boolean)): boolean {
    if (!key.startsWith('class$')) return false;
    const name = key.substring('class$'.length);
    reactiveBindingEnable(value, (v) => {
        el.classList[v ? 'add' : 'remove'](name);
    });
    return true;
}