/*
 * @Author: tackchen
 * @Date: 2022-10-11 08:45:14
 * @Description: Coding something
 */

import {IJson, IComputedItem} from 'alins-utils';
import {mountParentWithTChild} from '../mount';
import {compControllers, ICompControllers} from '../controller/controller';
import {IMountBuilderParameter, TElementChild} from '../builder/builder';
import {IEvent, IEventFunc} from './event';
import {IProp} from './prop';
import {ISlot, TSlotElement, TSlotFunction} from './slot';

export type TCompArgs = IProp | IEvent | ISlot;
export type TCompBuildFunc = () => TCompArgs[];

export type TCompBuilderArg = TCompArgs | TCompBuildFunc;

export interface IComponentOptions<T extends 'slot' | 'slots' = 'slot'> {
    props: IJson<IComputedItem>;
    events: IJson<IEventFunc>;
    slots: T extends 'slot' ? TSlotFunction : TSlotElement;
}
export interface IComponent<T extends 'slot' | 'slots' = 'slot'> {
    (options: IComponentOptions<T>): TElementChild;
}

export type TCompArg = string; // prop event slot
export interface IComponentBuilder extends IMountBuilderParameter {
    exe(): TElementChild;
    type: 'comp';
    _asParent(builders: TElementChild[]): void;
}

export type ICompControlConstructor = ((
    ...args: TCompBuilderArg[]
) => IComponentBuilder) & IComponentBuilder & ICompControllers<'comp'>

export interface ICompConstructor extends ICompControllers<'comp'> {
    (component: IComponent): ICompControlConstructor;
}

function createComponentBuilderBase (component: IComponent, args: TCompBuilderArg[]) {
    const children: TElementChild[] = [];
    return {
        exe () {
            const options: IComponentOptions<any> = {
                props: {},
                events: {},
                slots: {}
            };
            for (let i = 0; i < args.length; i++) {
                const item = args[i];
                if (typeof item === 'function') {
                    args.push(...item());
                } else if (item) {
                    switch (item.type) {
                        case 'prop': options.props = item.exe(); break;
                        case 'event': options.events = item.exe(); break;
                        case 'slot': options.slots = item.exe(); break;
                    }
                }
            }
            if (!component) throw new Error('Component not found');
            let result = component(options);

            if (children.length > 0) {
                if (result instanceof Array) result.push(children as any);
                else result = [result, children];
            }
            return result;
        },
        type: 'comp',
        mount (parent = 'body') {
            mountParentWithTChild(parent, this);
        },
        _asParent (builders: TElementChild[]) {
            children.push(...builders);
        }
    } as IComponentBuilder;
}


export const comp: ICompConstructor = Object.assign(((component: IComponent) => {
    return Object.assign((...args: TCompBuilderArg[]) => {
        return createComponentBuilderBase(component, args);
    }, createComponentBuilderBase(component, []), compControllers);
}), compControllers);


// export const comp: ICompConstructor = Object.assign(((...args: TCompBuilderArg[]) => {
//     // const mapValue = CompMap.get(el);
//     // if (mapValue) return mapValue;

//     // CompMap.set(el, comp);

//     const children: TElementChild[] = [];

//     return {
//         exe () {
//             const options: IComponentOptions<any> = {
//                 props: {},
//                 events: {},
//                 slots: {}
//             };
//             let component: IComponent | null = null;
//             for (let i = 0; i < args.length; i++) {
//                 const item = args[i];
//                 if (typeof item === 'function') {
//                     if (i === 0) {
//                         component = item as IComponent;
//                     } else {
//                         args.push(...(item as TCompBuildFunc)());
//                     }
//                 } else if (item) {
//                     switch (item.type) {
//                         case 'prop': options.props = item.exe(); break;
//                         case 'event': options.events = item.exe(); break;
//                         case 'slot': options.slots = item.exe(); break;
//                     }
//                 }
//             }
//             if (!component) throw new Error('Component not found');
//             let result = component(options);

//             if (children.length > 0) {
//                 if (result instanceof Array) result.push(children as any);
//                 else result = [result, children];
//             }
//             return result;
//         },
//         type: 'comp',
//         mount (parent = 'body') {
//             mountParentWithTChild(parent, this);
//         },
//         _asParent (builders: TElementChild[]) {
//             children.push(...builders);
//         }
//     } as IComponentBuilder;
// }), compControllers);
