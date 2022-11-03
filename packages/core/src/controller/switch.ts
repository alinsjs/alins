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
import {IMountBuilderParameter} from 'alins-utils/src/types/common.d';
import {IReactItem} from 'alins-utils/src/types/react.d';
import {mount} from '../mount';
import {
    getControllerDoms, IControllerConstructor, IControllerDom, IControllerDoms, parseHTMLElement, replaceControllerDoms,
    TControllerArg, TControllerBuilder, TControllerType
} from './controller';

export type TSwitchArg<T> = IReactItem<T> | (()=>T);

export interface ISwitchBuilder<T, K extends TControllerType> extends IMountBuilderParameter{
    case: ICase<T, K>;
    default: IDefault<T, K>;
    exe(): IControllerDom;
    type: 'switch';
}

interface ICase<T, K extends TControllerType> {
    (bool: T): ((...args: TControllerArg<K>) => ISwitchBuilder<T, K>);
}
interface IDefault<T, K extends TControllerType>{
    (...args: TControllerArg<K>): ISwitchBuilder<T, K>;
}

export interface ISwitchController<K extends TControllerType = 'builder'> {
    <T>(
        this: IControllerConstructor,
        value: TSwitchArg<T>,
    ): ISwitchBuilder<T, K>;
}

// div.if(num.value > 1)(react`:${bool}`),
// div.if(bool)(react`:${num.value}`),

export const switchController: ISwitchController = function <T> (this: IControllerConstructor, value: TSwitchArg<T>) {
    const defaultValue = Symbol('def');
    const node = document.createComment('');

    const builders: Map<any, TControllerBuilder> = new Map();

    const doms: Map<any, IControllerDoms> = new Map(); // ! 缓存doms节点
    const getDom = (value: any) => {
        const builder = builders.get(value) || builders.get(defaultValue);
        
        if (!builder) {
            return node;
        }
        const dom = doms.get(builder);
        if (dom) return dom;
        const {children} = getControllerDoms(builder);
        doms.set(builder, children);
        return children;
    };

    const addBuilder = (args: TControllerArg<any>, value: any) => {
        const builder = this.apply(null, args) as TControllerBuilder;
        builders.set(value, builder);
    };

    const react = transformToReaction(value);

    return {
        exe () {
            let node = getDom(react.value);
            react[subscribe](v => {
                const newDom = getDom(v);
                if (newDom === node) return;
                replaceControllerDoms(node as any, newDom);
                node = newDom;
            });
            return parseHTMLElement(node);
        },
        case (value: T) {
            return (...args) => {
                addBuilder(args, value);
                return this;
            };
        },
        default (...args) {
            addBuilder(args, defaultValue);
            return this;
        },
        type: 'switch',
        mount (parent = 'body') {
            mount(parent, this);
        }
    } as ISwitchBuilder<T, any>;
};