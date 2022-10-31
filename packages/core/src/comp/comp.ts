/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IJson, IBuilderParameter} from 'alins-utils/src/types/common.d';
import {IComputedItem} from 'alins-utils/src/types/react.d';
import {mount} from '../mount';
import {compControllers, ICompControllers} from '../controller/controller';
import {TChild} from '../element/transform';
import {IEvent, IEventFunc} from './event';
import {IProp} from './prop';
import {ISlot, TSlotElement, TSlotFunction} from './slot';

export type TCompArgs = IProp | IEvent | ISlot;
export type TCompBuildFunc = () => TCompArgs[];

export type TCompBuilderArg = IComponent | TCompArgs | TCompBuildFunc;

export interface IComponentOptions<T extends 'slot' | 'slots' = 'slot'> {
    props: IJson<IComputedItem>;
    events: IJson<IEventFunc>;
    slots: T extends 'slot' ? TSlotFunction : TSlotElement;
}
export interface IComponent<T extends 'slot' | 'slots' = 'slot'> {
    (options: IComponentOptions<T>): TChild;
}

export type TCompArg = string; // prop event slot
export interface IComponentBuilder extends IBuilderParameter {
    exe(): TChild;
    type: 'comp';
    mount(parent?: string | HTMLElement): void;
}
export interface ICompConstructor extends ICompControllers<'comp'> {
    (...args: (IComponent | TCompBuilderArg)[]): IComponentBuilder;
}

export const comp: ICompConstructor = Object.assign(((...args: TCompBuilderArg[]) => {
    // const mapValue = CompMap.get(el);
    // if (mapValue) return mapValue;

    // CompMap.set(el, comp);

    return {
        exe () {
            const options: IComponentOptions<any> = {
                props: {},
                events: {},
                slots: {}
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
                        case 'prop': options.props = item.exe(); break;
                        case 'event': options.events = item.exe(); break;
                        case 'slot': options.slots = item.exe(); break;
                    }
                }
            }
            if (!component) throw new Error('Component not found');
            return component(options);
        },
        type: 'comp',
        mount (parent: string | HTMLElement = 'body') {
            mount(parent, this);
        }
    } as IComponentBuilder;
}), compControllers);
