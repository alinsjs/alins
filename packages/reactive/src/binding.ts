/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 14:23:09
 * @Description: Coding something
 */

import {isProxy} from './proxy';
import {AlinsType, IRefData, ISimpleValue, join, type} from 'alins-utils';
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
    ...reactions: (IRefData<any>|(()=>any)|any)[]
): string|IReactBindingResult {
    for (let i = 0; i < reactions.length; i++) {
        const reaction = reactions[i];
        if (!isProxy(reaction) && typeof reaction !== 'function') {
            template[i] = `${template[i]}${reaction}${template[i + 1]}`;
            template.splice(i + 1, 1);
            reactions.splice(i, 1);
            i--;
        }
    }
    console.log(template, reactions);
    if (reactions.length === 0) {
        return template[0];
    }
    const fn = (onchange: IBindingChange) => {
        let prevStr = '';
        let values: string[] = [];
        values = reactions.map((reaction, index) => {
            watch(reaction, (nv: any) => {
                values[index] = nv;
                const v = join(template, values);
                onchange(v, prevStr);
                prevStr = v;
            }, false);
            return typeof reaction === 'function' ? reaction() : reaction.value;
        });
        return join(template, values);
    };
    // @ts-ignore
    fn[type] = AlinsType.BindResult;
    return fn as IReactBindingResult;
}

export function isBindingResult (fn: any) {
    return fn[type] === AlinsType.BindResult;
}