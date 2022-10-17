/*
 * @Author: tackchen
 * @Date: 2022-10-17 16:33:44
 * @Description: Coding something
 */
// export type TEventName = keyof HTMLElementEventMap;

import {IBuilderParameter} from '../core';

export interface IEventBuilder extends IBuilderParameter {
    exe(dom: HTMLElement): void;
    type: 'event';
    name: string;
}

export function on (name: string, listener: ()=> void): IEventBuilder {
    return {
        exe (dom: HTMLElement) {
            dom.addEventListener(name, listener);
        },
        type: 'event',
        name,
    };
}