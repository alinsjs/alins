/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 21:27:12
 * @Description: Coding something
 */

import {
    IBindingChange, IReactBindingResult, isBindingResult,
    isProxy, isRef, watch, IBindingReaction
} from 'alins-reactive';
import {AlinsType, IJson, IRefData, type} from 'alins-utils';
import {IIfReturn} from './controller/if';
import {IElement, ITextNode} from './renderer';


export interface IElementBuilder {
  [type]: AlinsType.ElementBuilder;
  dom: ()=>IElement;
  mount(parent: IElementLike): void;
  appendChild(parent: IElementLike): void;
}


export type IElementLike = ITextNode|IElement|IElementBuilder;

type IChild = IIfReturn|{value:any}|IElementLike|IBindingReaction|null|IChild[];

export type IChildren = IChild[]|IChild;

export function isElementLike (el: any) {
    return [
        AlinsType.TextNode,
        AlinsType.Element,
        AlinsType.ElementBuilder
    ].includes(el[type]);
}

interface IBindingReactionEnableObj {
  value: IBindingReaction,
  enable: IRefData<boolean> | (()=>boolean),
}
export type IBindingReactionEnable = IBindingReaction | IBindingReactionEnableObj;

export function reactiveBindingEnable (
    arg: IBindingReactionEnable,
    onchange: IBindingChange,
    onenable:(v:boolean)=>void
) {
    const type = typeof arg;
    const isEnableObject = (type === 'object' && !isProxy(arg) && typeof (arg as any).enable !== 'undefined');
    const value: IBindingReaction = isEnableObject ? (arg as IBindingReactionEnableObj).value : arg as IBindingReaction;

    if (isEnableObject) {
        onenable(watch((arg as IBindingReactionEnableObj).enable, onenable as any).value);
    }

    return reactiveBinding(value, onchange);
}

export function reactiveBinding (bind: IBindingReaction, onchange: IBindingChange): string {
    if (isBindingResult(bind)) {
        return (bind as IReactBindingResult)(onchange);
    }
    if (typeof bind === 'function' || isRef(bind)) {
        return watch(bind, onchange).value;
    }
    return typeof bind === 'string' ? bind : bind.toString();
}

export function reactiveClass (
    arg: IBindingReaction | IJson<IBindingReaction>,
    onchange: (key: string, value: string)=>void
): string {
    if (!isRef(arg) && typeof arg === 'object') {
        arg = arg as IJson<IBindingReaction>;
        let list: Set<string>;
        const map: IJson<boolean> = {};
        if (arg.$value) {
            const value = reactiveBinding(arg.$value, (v) => {
                const set: Set<string> = new Set([]);
                for (const k in map) {
                    if (map[k] === true) set.add(k);
                }
                v.split(' ').forEach((name) => {
                    if (map[name] !== false) set.add(name);
                });
                onchange('', Array.from(set).join(' '));
            });
            list = new Set<string>(value.split(' '));
            delete arg.$value;
        } else {
            list = new Set<string>([]);
        }
        for (const k in arg) {
            list[(map[k] = !!reactiveBinding(arg[k], (v) => {
                // @ts-ignore
                map[k] = v;
                onchange(k, v);
            })) ? 'add' : 'delete'](k);
        }
        return Array.from(list).join(' ');
    } else {
        return reactiveBinding(arg as IBindingReaction, (v) => {
            onchange('', v); // ! key 为空表示重新设置class
        });
    }
}