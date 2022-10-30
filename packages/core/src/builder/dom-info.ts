/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 12:35:18
 * @Description: Coding something
 */

import {$} from 'alins-reactive';
import {IJson} from 'alins-utils/src/types/common';
import {IReactBuilder, TReactionItem} from 'alins-utils/src/types/react';

function commonCompose<T> () {
    const templateArray: string[] = [];
    const reactions: TReactionItem<T>[] = [];

    return {
        add (template: string, item?: TReactionItem<T>) {
            templateArray.push(template);
            if (item) reactions.push(item);
        },

        react (tail: string) {
            templateArray.push(tail);
            (templateArray as any).raw = []; // ! as TemplateStringsArray
            return $(templateArray as any, ...reactions);
        }
    };
}

export function cls (json: IJson<boolean|TReactionItem<boolean>>): IReactBuilder {
    
    // cls({'active': active}),
    // $`.${() => active.value ? 'active' : ''}`,
    const target = commonCompose<string>();

    let template = '';
    for (const name in json) {
        const item = json[name];
        if (typeof item === 'boolean') {
            if (item) template += `.${name}`;
        } else {
            template += '.';
            target.add(template, (typeof item === 'function') ?
                (() => item() ? name : '') :
                () => item.value ? name : ''
            );
            template = '';
        }
    }
    return target.react(template);
}

export function attr (json: IJson<string|number|boolean|TReactionItem<string|number|boolean>>): IReactBuilder {
    // attr({'active': active}),
    // $`[active = ${() => active.value}]`,

    const target = commonCompose<string|number|boolean>();

    let template = '';
    for (const name in json) {
        const item = json[name];
        template += `[${name}=`;
        const type = typeof item;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            template += `${item}]`;
        } else {
            target.add(template, item);
            template = ']';
        }
    }
    return target.react(template);
}