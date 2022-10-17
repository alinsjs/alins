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

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IElementBuilder} from '../element/transform';
import {computed} from '../reactive/computed';
import {IReactItem, IReactWrap, subscribe} from '../reactive/react';

export interface IIfController {
    <T>(
        this: IBuilderConstructor,
        bool: IReactItem<T> | (()=>boolean),
    ): ((...args: TBuilderArg[]) => IElementBuilder);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),
export const ifController: IIfController = function (this: IBuilderConstructor, bool) {
    const comment = document.createComment('<!---->');
    
    if (typeof bool === 'function') {
        const v = computed(bool);
    }
    
    bool[subscribe](v => {
        
    });

    return (...args) => {
        return this.apply(null, args);
    };
};