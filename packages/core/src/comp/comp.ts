/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IJson, IBuilderParameter} from 'alins-utils/src/types/common.d';
import {IComputedItem} from 'alins-utils/src/types/react.d';
import {controllers, IControllers} from '../controller/controller';
import {TChild} from '../element/transform';
import {IEvent, IEventFunc} from './event';
import {IProp} from './prop';
import {ISlot, TSlotElement} from './slot';

export type TCompArgs = IProp | IEvent | ISlot;
export type TCompBuildFunc = () => TCompArgs[];

export type TCompBuilderArg = IComponent | TCompArgs | TCompBuildFunc;

export interface IComponentOptions {
    prop: IJson<IComputedItem>;
    event: IJson<IEventFunc>;
    slot: TSlotElement;
}
export interface IComponent {
    (options: IComponentOptions): TChild;
}

export type TCompArg = string; // prop event slot
export interface IComponentBuilder extends IBuilderParameter {
    exe(): TChild;
    type: 'comp';
}
export interface ICompConstructor extends IControllers<'comp'> {
    (...args: (IComponent | TCompBuilderArg)[]): IComponentBuilder;
}

// const CompMap: Map<Function, IComponentElement> = new Map(); // 或者可以使用 func.toString md5

// todo ? 为什么这里类型提示有问题
export const comp: ICompConstructor = Object.assign(((...args: TCompBuilderArg[]) => {
    // const mapValue = CompMap.get(el);
    // if (mapValue) return mapValue;


    // CompMap.set(el, comp);

    return {
        exe () {
            const options: IComponentOptions = {
                prop: {},
                event: {},
                slot: {}
            };
            let component: IComponent | null = null;
            for (let i = 0; i < args.length; i++) {
                const item = args[i];
                if (typeof item === 'function') {
                    if (i === 0) {
                        component = item as IComponent;
                    } else {
                        args.push(...(item as TCompBuildFunc)());
                    }
                } else if (item) {
                    switch (item.type) {
                        case 'prop': options.prop = item.exe(); break;
                        case 'event': options.event = item.exe(); break;
                        case 'slot': options.slot = item.exe(); break;
                    }
                }
            }
            if (!component) throw new Error('Component not found');
            return component(options);
        },
        type: 'comp',
    } as IComponentBuilder;
}), controllers);
