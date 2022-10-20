/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {createReactive, index, IReactItem, IReactObject, IReactWrap, mergeReact, subscribe} from '../reactive/react';

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
        const mount = document.createComment('');
        const doms: (HTMLElement|null)[] = [];
        const builders: IElementBuilder[] = [];
        // ! 性能优化 检测到没有index引用就不创建 indexReactive
        const makeBuilder = (callback.length === 2) ? (i: number, item?: IReactWrap<any>) => {
            const indexReactive = createReactive(i);
            if (typeof item === 'undefined') item = list[i];
            item[index] = indexReactive;
            return callback(item as any, indexReactive);
        } : (i: number, item?: IReactWrap<any>) => {
            if (typeof item === 'undefined') item = list[i];
            return callback(item as any, undefined as any);
        };
        // console.log('callback_tostring', callback.toString());
        for (let i = 0; i < list.length; i++) {
            const builder = makeBuilder(i);
            // builder.unshift(num);
            // console.log('forController_builder', i, builder);
            builders.push(this.apply(null, builder));
        }
        const p = list as any as IReactObject<any>;
        p[subscribe]((newValue, oldValue, i) => {
            // v: reaction
            const oldIndex = list.indexOf(newValue); // 仅仅是移动了位置的元素
            if (oldIndex !== -1) {
                const oldDom = doms[i];
                doms[i] = doms[oldIndex];
                doms[oldIndex] = oldDom;
                newValue[index].value = i;
            } else {
                if (typeof newValue === 'undefined') { // remove
                    doms[i]?.remove();
                    doms.splice(i, 1);
                } else {
                    const builder = this.apply(null, makeBuilder(i, newValue));
                    const oldDom = doms[i];
                    if (oldDom) {
                        mergeReact(oldValue, newValue);
                    } else {
                        const dom = transformBuilderToDom(builder);
                        const after = doms[i + 1];
                        mount.parentElement?.insertBefore(dom, after || mount);
                        doms[i] = dom;
                    }
                }
            }
        });
        return {
            exe () {
                const frag = document.createDocumentFragment();
                frag.append(mount);
                for (const child of builders) {
                    const dom = transformBuilderToDom(child);
                    doms.push(dom);
                    // ! 关键代码 根据build解析dom 渲染到父元素
                    frag.appendChild(dom);
                }
                return frag;
            },
            type: 'for',
        };
    };

};