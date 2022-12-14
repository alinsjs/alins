/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {
    IBuilderConstructor, TBuilderArg,
    IElementBuilder, IMountBuilderParameter,
} from '../builder/builder';
import {
    createReactive, index, subscribe
} from 'alins-reactive';
import {IReactObject, IReactWrap, IReactItem} from 'alins-utils';
import {ICompConstructor, IComponentBuilder, TCompBuilderArg} from '../comp/comp';
import {getControllerDoms, removeControllerDoms, TControllerBuilder, TControllerType} from './controller';
import {insertBefore} from '../builder/dom-proxy';
import {mountParentWithTChild} from '../mount';

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
export interface IForBuilder extends IMountBuilderParameter{
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
        const mountNode = document.createComment('');
        const doms: (HTMLElement|HTMLElement[])[] = [];
        const builders: (IElementBuilder|IComponentBuilder)[] = [];
        // // ! ???????????? ???????????????index?????????????????? indexReactive
        // ?????? index ?????????????????? indexReactive ??????????????????????????????index????????????
        const makeBuilder = (i: number, item?: IReactWrap<any>) => {
            const indexReactive = createReactive(i);
            if (typeof item === 'undefined') item = list[i];
            item[index] = indexReactive;
            const result = callback(item as any, indexReactive);
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
            if (typeof i !== 'number') return;
            // v: reaction
            const oldIndex = list.indexOf(newValue);
            // console.warn('oldIndex=', oldIndex, '-oldValue=', oldValue?.value, '-new index', i, '-new Value', newValue?.value);
            if (oldIndex !== -1) { // ?????????????????????????????????
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
                        // console.log('mergeReact4');
                        // ! ??????????????? proxy?????????merge???
                        // mergeReact(oldValue, newValue);
                    } else {
                        const {dom, children} = getControllerDoms(builder);
                        doms[i] = children;
                        const item = doms[i + 1];
                        const after = item instanceof Array ? item[0] : item;
                        insertBefore(mountNode.parentElement as HTMLElement, dom, after || mountNode);
                    }
                }
            }
        });
        return {
            exe () {
                const frag = document.createDocumentFragment();
                for (const child of builders) {
                    // ! ??????build??????dom ??????????????????
                    // child.type
                    const {dom, children} = getControllerDoms(child);
                    doms.push(children);
                    frag.appendChild(dom);
                }
                frag.append(mountNode); // ?????????????????????
                return frag;
            },
            type: 'for',
            mount (parent = 'body') {
                mountParentWithTChild(parent, this);
            }
        };
    };

};

