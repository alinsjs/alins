/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IJson} from '../common';
import {IControllerBuilder} from '../controller/controller';
import {IBuilderParameter} from '../core';
import {IElement, IElementBuilder, TElementChild} from '../element/transform';
import {IComputedItem} from '../reactive/computed';
import {IEvent, IEventFunc} from './event';
import {IProp} from './prop';
import {ISlot} from './slot';

export type TCompBuilderArg = IComponent | IProp | IEvent | ISlot;

export interface IComponentOptions {
    props: IJson<IComputedItem>;
    events: IJson<IEventFunc>;
    slots: IJson<TElementChild>;
}
export interface IComponent {
    (options: IComponentOptions): IElementBuilder;
}

export type TCompArg = string; // props event slot
export interface IComponentBuilder extends IBuilderParameter {
    exe(): IElement;
    type: 'comp';
}
export interface ICompConstructor{ // extends IControllerBuilder
    (comp: IComponent, ...args: TCompBuilderArg[]): IComponentBuilder;
}

// const CompMap: Map<Function, IComponentElement> = new Map(); // 或者可以使用 func.toString md5

export const comp: ICompConstructor = (...args) => {
    // const mapValue = CompMap.get(el);
    // if (mapValue) return mapValue;


    // CompMap.set(el, comp);

    return {
        exe () {
            const options: IComponentOptions = {
                props: {},
                events: {},
                slots: {}
            };
            let component: IComponent | null = null;
            for (let i = 0; i < args.length; i++) {
                const item = args[i];
                if (typeof item === 'function') {
                    component = item;
                } else {
                    switch (item.type) {
                        case 'prop': options.props = item.exe(); break;
                        case 'event': options.events = item.exe(); break;
                        case 'slot': options.slots = item.exe(); break;
                    }
                }
            }
            if (!component) throw new Error('Component not found');
            return component(options).exe();
        },
        type: 'comp',
    };
};