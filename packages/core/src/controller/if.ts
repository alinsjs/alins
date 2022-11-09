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

import {subscribe, transformToReaction} from 'alins-reactive';
import {IReactItem} from 'alins-utils';
import {mountParentWithTChild} from '../mount';
import {getControllerDoms, IControllerConstructor, IControllerDom, IControllerDoms, parseHTMLElement, replaceControllerDoms, TControllerArg, TControllerBuilder, TControllerType} from './controller';
import {IMountBuilderParameter} from '../builder/builder';

export type TIfArg = IReactItem<boolean> | (()=>boolean);

export interface IIfBuilder<K extends TControllerType> extends IMountBuilderParameter {
    elif: IElseIf<K>;
    else: IElse<K>;
    exe(): IControllerDom;
    type: 'if';
}

interface IElseIf<K extends TControllerType> {
    (bool: TIfArg): ((...args: TControllerArg<K>) => IIfBuilder<K>);
}
interface IElse<K extends TControllerType>{
    (...args: TControllerArg<K>): IIfBuilder<K>;
}

export interface IIfController<K extends TControllerType = 'builder'> {
    (
        this: IControllerConstructor,
        bool: TIfArg,
    ): ((...args: TControllerArg<K>) => IIfBuilder<K>);
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),


export const ifController: IIfController<any> = function (this: IControllerConstructor, bool) {
    const changeList: Function[] = [];
    const node = document.createComment('');

    let elseBuilder: null | TControllerBuilder = null;

    const builders: (TControllerBuilder)[] = [];

    const pushBuilder = (args: TControllerArg<any>, isElse = false) => {
        const builder = this.apply(null, args);
        if (isElse) elseBuilder = builder;
        else builders.push(builder);
    };

    let activeIndex = 0;

    const doms: IControllerDoms[] = []; // ! 缓存doms节点

    const getDom = (builder?: TControllerBuilder) => {
        if (!builder) return node;
        const oldDom = doms[activeIndex];
        if (oldDom) return oldDom;
        const {children} = getControllerDoms(builder);
        doms[activeIndex] = children;
        
        return children;
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
            let dom: HTMLElement | Node | null | HTMLElement[] = null;
            if (v) {
                if (i < activeIndex || activeIndex === -1) {
                    activeIndex = i;
                    const result = getControllerDoms(builders[i]);
                    dom = result.children;
                }
            } else if (activeIndex >= 0) {
                dom = exe(activeIndex);
            }
            if (dom) changeList.forEach(fn => fn(dom));
        });
        reactList.push(react);
    };

    pushReact(bool);
    return (...args: TControllerArg<any>) => {
        pushBuilder(args);
        return {
            exe () {
                let node = exe();
                changeList.push((newDom: HTMLElement | HTMLElement[]) => {
                    if (newDom === node) return;
                    replaceControllerDoms(node as any, newDom);
                    node = newDom;
                });
                return parseHTMLElement(node);
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
            type: 'if',
            mount (parent = 'body') {
                mountParentWithTChild(parent, this);
            }
        } as IIfBuilder<any>;
    };
};