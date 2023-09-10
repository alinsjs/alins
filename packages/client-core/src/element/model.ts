/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-21 22:37:05
 * @Description: Coding something
 */
import type { IRefData, ISimpleValue } from 'alins-utils';
import { isProxy, watch } from 'alins-reactive';
import type { IElement } from './renderer';

const ModelTag = {
    INPUT: 1, SELECT: 1, TEXTAREA: 1,
};

export function parseModel (
    dom: IElement,
    value: ISimpleValue | (()=>ISimpleValue) | IRefData<ISimpleValue>,
    k: string,
): boolean {
    if (k !== 'value' && k !== 'checked') return false;

    // @ts-ignore
    if (!isProxy(value) && !value.__deco) return false; // 不是proxy不支持双向绑定
    const tag = dom.tagName;
    if (!ModelTag[tag]) return false;

    // @ts-ignore
    const type = value.__deco || typeof value.v;
    let parseType = ({
        'boolean': v => v === 'true',
        'number': v => parseFloat(v),
        'string': v => v,
    })[type];

    if (!parseType) parseType = v => v;
    // @ts-ignore
    const bindValue = value.__deco ? value.v : value;

    const eventName = tag === 'SELECT' ? 'change' : 'input';
    dom.addEventListener(eventName, () => {
        let newValue = dom[k];
        if (type !== typeof newValue) {
            newValue = parseType(newValue);
        }
        bindValue.v = Number.isNaN(newValue) ? '' : newValue;
    });
    watch(bindValue, (v: any) => {
        dom[k] = v;
    }, false);
    dom[k] = bindValue.v;
    return true;
}