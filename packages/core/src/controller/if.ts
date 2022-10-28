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
import {subscribe, transformToReaction} from 'alins-reactive';
import {IBuilderParameter} from 'alins-utils/src/types/common.d';
import {IReactItem} from 'alins-utils/src/types/react.d';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {TControllerArg, TControllerType} from './controller';
import {TCompBuilderArg} from '../comp/comp';

export type TIfArg = IReactItem<boolean> | (()=>boolean);

export interface IIfBuilder<K extends TControllerType> extends IBuilderParameter {
    elif: IElseIf<K>;
    else: IElse<K>;
    exe(): Node|HTMLElement;
    type: 'if';
}

interface IElseIf<K extends TControllerType> {
    (bool: TIfArg): ((...args: TControllerArg<K>[]) => IIfBuilder<K>);
}
interface IElse<K extends TControllerType>{
    (...args: TControllerArg<K>[]): IIfBuilder<K>;
}

export interface IIfController<K extends TControllerType = 'builder'> {
    (
        this: IBuilderConstructor,
        bool: TIfArg,
    ): ((...args: TControllerArg<K>[]) => IIfBuilder<K>);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),


export const ifController: IIfController = function (this: IBuilderConstructor, bool) {
    type TArgs = (TBuilderArg|TCompBuilderArg)[];
    const changeList: Function[] = [];
    const node = document.createComment('');

    let elseBuilder: null | IElementBuilder = null;

    const builders: IElementBuilder[] = [];

    const pushBuilder = (args: TArgs, isElse = false) => {
        const builder = this.apply(null, args) as IElementBuilder;
        if (isElse) elseBuilder = builder;
        else builders.push(builder);
    };

    let activeIndex = 0;

    const doms: (Node|HTMLElement) [] = []; // ! 缓存doms节点

    const getDom = (builder?: IElementBuilder) => {
        if (!builder) return node;
        let dom = doms[activeIndex];
        if (dom) return dom;
        dom = transformBuilderToDom(builder);
        doms[activeIndex] = dom;
        return dom;
    };

    const exe = (start = 0) => {
        for (let i = start; i < reactList.length; i++) {
            if (reactList[i].value === true) {
                activeIndex = i;
                return getDom(builders[i]);
            }
        }
        if (elseBuilder) {
            activeIndex = reactList.length;
            return getDom(elseBuilder);
        }
        activeIndex = -1;
        return getDom();
    };

    const reactList: IReactItem<boolean>[] = [];

    const pushReact = (bool: TIfArg) => {
        const i = reactList.length;
        const react = transformToReaction(bool);
        react[subscribe](v => {
            let dom: HTMLElement | Node | null = null;
            if (v) {
                if (i < activeIndex || activeIndex === -1) {
                    activeIndex = i;
                    dom = transformBuilderToDom(builders[i]);
                }
            } else if (activeIndex >= 0) {
                dom = exe(activeIndex);
            }
            if (dom) changeList.forEach(fn => fn(dom));
        });
        reactList.push(react);
    };

    pushReact(bool);
    return (...args: TArgs) => {
        pushBuilder(args);
        return {
            exe () {
                let node = exe();
                changeList.push((d: Node) => {
                    if (d === node) return;
                    const parent = node.parentElement;
                    parent?.insertBefore(d, node);
                    parent?.removeChild(node);
                    node = d;
                });
                return node;
            },
            elif (bool) {
                pushReact(bool);
                return (...args) => {
                    pushBuilder(args);
                    return this;
                };
            },
            else (...args) {
                pushBuilder(args, true);
                return this;
            },
            type: 'if'
        } as IIfBuilder<any>;
    };
};