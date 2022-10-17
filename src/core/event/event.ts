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

export function on (name: string, listener: (...args: any[])=> void): IEventBuilder {
    return {
        exe (dom: HTMLElement) {
            dom.addEventListener(name, listener);
        },
        type: 'event',
        name,
    };
}

// todo add
export const [
    click,
    mousedown,
    mouseup,
    mousemove,
] = [
    'click',
    'mousedown',
    'mouseup',
    'mousemove',
].map(name => {
    // todo add event args
    return (listener: (...args: any[])=> void) => on(name, listener);
});