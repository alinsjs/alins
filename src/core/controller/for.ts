/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {createReactive, index, IReactItem, IReactWrap} from '../reactive/react';

// export interface IForController {
//     <T>(
//         list: IReactWrap<T>[],
//         callback: (item: IReactWrap<T>, index: IReactItem<number>) => IElementBuilder
//     ): IElementBuilder[];
// }

// export interface IForCallback<T = any> {
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
export interface IForBuilder extends IBuilderParameter{
    exe(): DocumentFragment;
    type: 'for';
}


export interface IForController {
    <T>(list: IReactWrap<T>[]):
        ((fn: IForCallback<T>) => IForBuilder);
}

export interface IForCallback<T = any> {
    (item: IReactWrap<T>, index: IReactItem<number>): TBuilderArg[];
}

export const forController: IForController = function (this: IBuilderConstructor, list) {
    // return (fn) => list.map((item, index) => this.call(null, ...fn(item, index)));
    // console.count('forController');
    // console.log('forController', list);
    return (callback) => {
        const builders: IElementBuilder[] = [];
        // ! 性能优化 检测到没有index引用就不创建 indexReactive
        const makeBuilder = (callback.length === 2) ? (i: number) => {
            const indexReactive = createReactive(i);
            list[i][index] = indexReactive;
            return callback(list[i], indexReactive);
        } : (i: number) => {
            return callback(list[i], undefined as any);
        };
        // console.log('callback_tostring', callback.toString());
        for (let i = 0; i < list.length; i++) {
            const builder = makeBuilder(i);
            debugger;
            // builder.unshift(num);
            // console.log('forController_builder', i, builder);
            builders.push(this.apply(null, builder));
        }
        return {
            exe () {
                const frag = document.createDocumentFragment();
                for (const child of builders) {
                    // ! 关键代码 根据build解析dom 渲染到父元素
                    frag.appendChild(transformBuilderToDom(child));
                }
                debugger;
                return frag;
            },
            type: 'for',
        };
    };

};