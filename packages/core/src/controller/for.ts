/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:31:28
 * @Description: Coding something
 */

import {IBuilderConstructor, TBuilderArg} from '../builder/builder';
import {IElementBuilder, mountSingleChild, transformBuilderToDom} from '../element/transform';
import {
    createReactive, index, mergeReact, subscribe
} from 'alins-reactive';
import {IBuilderParameter} from 'alins-utils/src/types/common.d';
import {IReactObject, IReactWrap, IReactItem} from 'alins-utils/src/types/react.d';
import {ICompConstructor, IComponentBuilder} from 'src/comp/comp';

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
            return callback(item as any, indexReactive);
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
            console.warn('oldIndex=', oldIndex, '-oldValue=', oldValue?.value, '-new index', i, '-new Value', newValue?.value);
            debugger;
            // todo bugfix list.unshift(0);
            if (oldIndex !== -1) {
                const oldDom = doms[i];
                doms[i] = doms[oldIndex];
                doms[oldIndex] = oldDom;
                newValue[index].value = i;
            } else {
                if (typeof newValue === 'undefined') { // remove
                    const item = doms[i];
                    if (item instanceof Array) {
                        item.forEach(i => {i.remove();});
                    } else {
                        item.remove();
                    }
                    doms.splice(i, 1);
                } else {
                    const builder: IElementBuilder|IComponentBuilder = this.apply(null, makeBuilder(i, newValue));
                    const oldDom = doms[i];
                    if (oldDom) {
                        mergeReact(oldValue, newValue);
                    } else {
                        const dom = builder.type === 'builder' ? transformBuilderToDom(builder) : mountSingleChild(builder.exe());
                        doms[i] = (dom instanceof HTMLElement) ? dom : [].slice.call(dom.children);
                        const item = doms[i + 1];
                        const after = item instanceof Array ? item[0] : item;
                        mount.parentElement?.insertBefore(dom, after || mount);
                        
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
                    if (child.type === 'comp') {
                        const item = mountSingleChild(child.exe());
                        doms.push([].slice.call(item.children));
                        frag.appendChild(item);
                    } else {
                        const dom = transformBuilderToDom(child);
                        doms.push(dom);
                        frag.appendChild(dom);
                    }
                }
                frag.append(mount); // 锚点放在最后面
                return frag;
            },
            type: 'for',
        };
    };

};