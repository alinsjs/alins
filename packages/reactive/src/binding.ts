/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 14:23:09
 * @Description: Coding something
 */

import {isRef} from './proxy';
import {AlinsType, IRefData, ISimpleValue, type} from 'alins-utils';
import {watch} from './watch';

export const binding = Symbol('b');

export type IBindingChange = (nv: string, ov: string)=>void;

export interface IReactBindingResult {
    (onchange: IBindingChange): string;
    [binding]: true;
}

export type IBindingReaction<T = any> = IRefData<T>|(()=>T)|IReactBindingResult|ISimpleValue;

export type IBindingRef<T=any> = IRefData<T>|(()=>T)|T;

export function createBinding (
    template: string[],
    reactions: IBindingReaction[]
): string|IReactBindingResult {
    // debugger;
    for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i];
        if (!isRef(reaction) && typeof reaction !== 'function') {
            template[i] = `${template[i]}${reaction}${template[i + 1]}`;
            template.splice(i + 1, 1);
            reactions.splice(i, 1);
            i--;
        }
    }
    // console.log(template, reactions);
    if (reactions.length === 0) {
        return template[0];
    }
    const fn = (onchange: IBindingChange) => {
        console.warn('debug:', reactions);
        const funcs = reactions.map((reaction: IRefData<any>|(()=>any)) => {
            return typeof reaction === 'function' ? () => reaction() : () => reaction.value;
        });
        const n = funcs.length;
        // @ts-ignore
        return (watch(() => {
            let str = template[0];
            for (let i = 0; i < n; i++) {
                str += funcs[i]() + template[i + 1];
            }
            return str;
        }, (nv: string, ov: string) => {
            onchange(nv, ov);
        }, false) as IRefData).value;
    };
    // @ts-ignore
    fn[type] = AlinsType.BindResult;
    return fn as IReactBindingResult;
}

export function isBindingResult (fn: any) {
    return fn[type] === AlinsType.BindResult;
}