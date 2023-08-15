/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import {isProxy} from 'alins-reactive';
import {reactiveBindingEnable} from './dom-util';

export function parseClassName (
    dom: HTMLElement,
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
            for (const k in v) dom.classList[(v[k] === false) ? 'remove' : 'add'](k);
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