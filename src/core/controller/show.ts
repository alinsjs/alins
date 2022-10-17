/*
 * @Author: tackchen
 * @Date: 2022-10-15 19:53:12
 * @Description: Coding something
 */
/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {type} from 'os';
import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {computed} from '../reactive/computed';
import {subscribe, transformToReaction} from '../reactive/react';
import {TIfArg} from './if';


export interface IShowBuilder extends IBuilderParameter {
    exe(): HTMLElement;
    type: 'show';
}


export interface IShowController {
    (
        this: IBuilderConstructor,
        bool: TIfArg,
    ): ((...args: TBuilderArg[]) => IShowBuilder);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

export const showController: IShowController = function (this: IBuilderConstructor, bool) {
    
    const react = transformToReaction(bool);
    const constructor = this;

    return (...args) => {
        return {
            exe () {
                const builder = constructor.apply(null, args);
                const dom = transformBuilderToDom(builder);
                react[subscribe](v => {
                    dom.style.display = v ? '' : 'none';
                });
                return dom;
            },
            type: 'show'
        };
    };
};