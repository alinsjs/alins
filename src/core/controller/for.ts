/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IElementBuilder} from '../element/transform';
import {createReactive, IReactItem, IReactWrap} from '../reactive/react';

// export interface IForController {
//     <T>(
//         list: IReactWrap<T>[],
//         callback: (item: IReactWrap<T>, index: IReactItem<number>) => IElementBuilder
//     ): IElementBuilder[];
// }

// export interface IForCallback<T=any> {
//     (item: IReactWrap<T>, index?: number): TBuilderArg[];
// }

// export const forController: IForController = (list, callback) => {
//     // todo reactive index
//     console.log('forController', list);
//     const builders: IElementBuilder[] = [];
//     for (let i = 0; i < list.length; i++) {
//         console.log('forController', i, list[i]);
//         const indexReactive = createReactive(i);
//         list[i].$index = indexReactive;
//         const builder = callback(list[i], indexReactive);
//         builders.push(builder);
//     }

//     return builders;
// };


export interface IForController {
    <T>(list: IReactWrap<T>[]):
        ((fn: IForCallback<T>) => IElementBuilder[]);
}

export interface IForCallback<T=any> {
    (item: IReactWrap<T>, index: IReactItem<number>): TBuilderArg[];
}

export const forController: IForController = function (this: IBuilderConstructor, list) {
    // return (fn) => list.map((item, index) => this.call(null, ...fn(item, index)));
    console.count('forController');
    console.log('forController', list);
    return (callback) => {
        const builders: IElementBuilder[] = [];
        for (let i = 0; i < list.length; i++) {
            const indexReactive = createReactive(i);
            list[i].$index = indexReactive;
            const builder = callback(list[i], indexReactive);
            // builder.unshift();
            builders.push(this.apply(null, builder));
        }

        return builders;

        // return list.map((item, index) => {
        //     // this is domBuilder
        //     return this.apply(null, fn(item, index));
        // });
    };
};