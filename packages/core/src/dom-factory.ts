/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-02 09:27:12
 * @Description: Coding something
 */

import {builder, IDomOptions} from './dom-builder';
import {IChildren, IElementBuilder} from './dom-util';
import {type} from 'alins-utils';

function isChildren (child: any) {
    return typeof child !== 'object' ||
      (child instanceof Array) ||
      (child instanceof Element) ||
      child instanceof Node ||
      !!child[type];
}

export function dom (arg: IDomOptions<IChildren[]|IChildren>|IChildren, tag = 'div') {
    const options = ((isChildren(arg)) ?
        {$child: arg} :
        arg) as IDomOptions;
    if (!options.$child) {
        options.$child = [];
    } else if (!Array.isArray(options.$child)) {
        options.$child = [options.$child];
    }
    options.$tag = tag;
    return builder(options);
}

export function domFactory (name: string) {
    return (options: IDomOptions<IChildren[]|IChildren>|IChildren): IElementBuilder => {
        return dom(options, name);
    };
}

export const div = domFactory('div');