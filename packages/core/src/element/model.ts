/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import type {IRefData, ISimpleValue} from "packages/utils/src";
import {isProxy, watch} from "packages/reactive/src";

const ModelTag = {
    INPUT: 1, SELECT: 1, TEXTAREA: 1,
}

export function parseModel(
    dom: HTMLElement,
    value: ISimpleValue | (()=>ISimpleValue) | IRefData<ISimpleValue>,
    k: string,
): boolean{
    if(k !== 'value' && k !== 'checked') return false
    if(!isProxy(value)) return false;
    const tag = dom.tagName;
    if(!ModelTag[tag]) return false;
    const type = typeof value.v;
    const parseType = ({
        'boolean': v => v === 'true',
        'number': v => parseFloat(v),
        'string': v => v,
    })[type]
    const eventName = tag === 'SELECT' ? 'change': 'input';
    dom.addEventListener(eventName, ()=>{
        let newValue = dom[k];
        if(type !== typeof newValue) {
            newValue = parseType(newValue);
        }
        value.v = dom[k];
    });
    watch(value, (v: any, ov: any) => {
        dom[k] = v;
    }, false);
    dom[k] = value.v;
    return true;
}