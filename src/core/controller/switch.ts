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
import {IBuilderParameter} from '../core';
import {IElementBuilder, transformBuilderToDom} from '../element/transform';
import {IReactItem, subscribe, transformToReaction} from '../reactive/react';

export type TSwitchArg<T> = IReactItem<T> | (()=>T);

export interface ISwitchBuilder<T> extends IBuilderParameter{
    case: ICase<T>;
    default: IDefault<T>;
    exe(parent: HTMLElement): Node|HTMLElement;
    type: 'switch';
}

interface ICase<T> {
    (bool: T): ((...args: TBuilderArg[]) => ISwitchBuilder<T>);
}
interface IDefault<T>{
    (...args: TBuilderArg[]): ISwitchBuilder<T>;
}

export interface ISwitchController {
    <T>(
        this: IBuilderConstructor,
        value: TSwitchArg<T>,
    ): ISwitchBuilder<T>;
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

export const switchController: ISwitchController = function <T> (this: IBuilderConstructor, value: TSwitchArg<T>) {
    const defaultValue = Symbol('def');
    const node = document.createComment('');

    const builders: Map<any, IElementBuilder> = new Map();

    const doms: Map<any, Node|HTMLElement> = new Map(); // ! 缓存doms节点
    const getDom = (value: any) => {
        const builder = builders.get(value) || builders.get(defaultValue);
        
        if (!builder) {
            return node;
        }
        let dom = doms.get(builder);
        if (dom) return dom;
        dom = transformBuilderToDom(builder);
        doms.set(builder, dom);
        return dom;
    };

    const addBuilder = (args: TBuilderArg[], value: any) => {
        const builder = this.apply(null, args) as IElementBuilder;
        builders.set(value, builder);
    };

    const react = transformToReaction(value);

    return {
        exe (parent: HTMLElement) {
            let node = getDom(react.value);

            react[subscribe](v => {
                const dom = getDom(v);
                if (dom === node) return;
                parent.insertBefore(dom, node);
                parent.removeChild(node);
                node = dom;
            });
            return node;
        },
        case (value: any) {
            return (...args) => {
                addBuilder(args, value);
                return this;
            };
        },
        default (...args) {
            addBuilder(args, defaultValue);
            return this;
        },
        type: 'switch'
    } as ISwitchBuilder<T>;
};