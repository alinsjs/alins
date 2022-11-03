/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IElementBuilder} from '../element/transform';
import {
    createReactive, index, mergeReact, subscribe
} from 'alins-reactive';
import {IBuilderParameter} from 'alins-utils/src/types/common.d';
import {IReactObject, IReactWrap, IReactItem} from 'alins-utils/src/types/react.d';
import {ICompConstructor, IComponentBuilder, TCompBuilderArg} from '../comp/comp';
import {getControllerDoms, removeControllerDoms, TControllerBuilder, TControllerType} from './controller';
import {insertBefore} from '../builder/dom-proxy';

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


export interface IForController<K extends TControllerType = 'builder'> {
    <T>(list: IReactWrap<T>[]):
        ((fn: IForCallback<K, T>) => IForBuilder);
}

export type TForControllerArg<K extends TControllerType> = K extends 'builder' ?
    TBuilderArg|TBuilderArg[] : TCompBuilderArg|TCompBuilderArg[];

export interface IForCallback<K extends TControllerType, T = any> {
    (item: IReactWrap<T>, index: IReactItem<number>): TForControllerArg<K>;
}

export const forController: IForController = function (this: IBuilderConstructor | ICompConstructor, list) {
    // return (fn) => list.map((item, index) => this.call(null, ...fn(item, index)));
    // console.count('forController');
    // console.log('forController', list);
    return (callback) => {
        const mount = document.createComment('');
        const doms: (HTMLElement|HTMLElement[])[] = [];
        const builders: (IElementBuilder|IComponentBuilder)[] = [];
        // // ! 性能优化 检测到没有index引用就不创建 indexReactive
        // 没有 index 引用也要创建 indexReactive 不然删除元素时会没有index作为索引
        const makeBuilder = (i: number, item?: IReactWrap<any>) => {
            const indexReactive = createReactive(i);
            if (typeof item === 'undefined') item = list[i];
            item[index] = indexReactive;
            const result = callback(item as any, indexReactive);
            debugger;
            console.log('11111111111111111');
            return Array.isArray(result) ? result : [result];
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
            const oldIndex = list.indexOf(newValue);
            // console.warn('oldIndex=', oldIndex, '-oldValue=', oldValue?.value, '-new index', i, '-new Value', newValue?.value);
            if (oldIndex !== -1) { // 仅仅是移动了位置的元素
                const oldDom = doms[i];
                doms[i] = doms[oldIndex];
                doms[oldIndex] = oldDom;
                newValue[index].value = i;
            } else {
                if (typeof newValue === 'undefined') { // remove
                    removeControllerDoms(doms[i]);
                    (doms[i] as any) = undefined;
                } else {
                    const builder: TControllerBuilder = this.apply(null, makeBuilder(i, newValue));
                    const oldDom = doms[i];
                    if (oldDom) {
                        mergeReact(oldValue, newValue);
                    } else {
                        const {dom, children} = getControllerDoms(builder);
                        doms[i] = children;
                        const item = doms[i + 1];
                        const after = item instanceof Array ? item[0] : item;
                        insertBefore(mount.parentElement as HTMLElement, dom, after || mount);
                    }
                }
            }
        });
        return {
            exe () {
                const frag = document.createDocumentFragment();
                for (const child of builders) {
                    // ! 根据build解析dom 渲染到父元素
                    // child.type
                    const {dom, children} = getControllerDoms(child);
                    doms.push(children);
                    frag.appendChild(dom);
                }
                frag.append(mount); // 锚点放在最后面
                return frag;
            },
            type: 'for',
        };
    };

};

