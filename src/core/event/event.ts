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

// prevent：阻止默认事件（常用）；
// stop：阻止事件冒泡（常用）；
// once：事件只触发一次（常用）；
// capture：使用事件的捕获模式；
// self：只有event.target是当前操作的元素时才触发事件；
type TEventDecorator = 'prevent' | 'stop' | 'capture' | 'once' | 'self';

export function on (
    name: string,
    listener: (...args: any[])=> void,
    ...decorators: TEventDecorator[]
): IEventBuilder {
    return {
        exe (dom: HTMLElement) {
            if (decorators.length === 0) {
                dom.addEventListener(name, listener);
            } else {
                const is = (name: TEventDecorator) => decorators.includes(name);
                const useCapture = is('capture');
                const handle = (...args: any[]) => {
                    const e = args[0] as Event;
                    if (is('self') && e.target !== dom) return;

                    if (is('stop')) e.stopPropagation();
                    if (is('prevent')) e.preventDefault();
                    listener.apply(dom, args);
                    if (is('once')) dom.removeEventListener(name, handle, useCapture);
                };
                dom.addEventListener(name, handle, useCapture);

            }
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