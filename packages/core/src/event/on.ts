/*
 * @Author: tackchen
 * @Date: 2022-10-17 16:33:44
 * @Description: Coding something
 */
// export type TEventName = keyof HTMLElementEventMap;

import {IBuilderParameter, IJson} from 'alins-utils/src/types/common.d';

export interface IEventBuilder extends IBuilderParameter {
    args(...args: any[]): IEventBuilder;
    exe(dom: HTMLElement): void;
    type: 'on';
    name: string;
}

export interface IEventConstructor {
    (
        listener: (...args: any[]) => void,
        ...decorators: TEventDecorator[]
    ): IEventBuilder;
}

// prevent：阻止默认事件（常用）；
// stop：阻止事件冒泡（常用）；
// once：事件只触发一次（常用）；
// capture：使用事件的捕获模式；
// self：只有event.target是当前操作的元素时才触发事件；
type TEventDecorator = 'prevent' | 'stop' | 'capture' | 'once' | 'self';

export function on (
    name: string
): IEventConstructor {
    return (
        listener: (...args: [...any[], Event, HTMLElement][])=> void,
        ...decorators: TEventDecorator[]
    ) => {
        const eventArgs: any[] = [];
        return {
            args (...args) {
                eventArgs.push(...args);
                return this;
            },
            exe (dom: HTMLElement) {
                if (decorators.length === 0) {
                    dom.addEventListener(name, (e) => {
                        listener.apply(dom, [...eventArgs, e, dom]);
                    });
                } else {
                    const is = (name: TEventDecorator) => decorators.includes(name);
                    const useCapture = is('capture');
                    const handle = (e: Event) => {
                        if (is('self') && e.target !== dom) return;
    
                        if (is('stop')) e.stopPropagation();
                        if (is('prevent')) e.preventDefault();
                        listener.apply(dom, [...eventArgs, e]);
                        if (is('once')) dom.removeEventListener(name, handle, useCapture);
                    };
                    dom.addEventListener(name, handle, useCapture);
                }
            },
            type: 'on',
            name,
        };
    };

}

const MainEventNames = [
    'click', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseup',
    'touchend', 'touchmove', 'touchstart', 'wheel', 'input', 'change'
] as const;

const EventNames = [
    ...MainEventNames,
    'fullscreenchange', 'fullscreenerror', 'copy', 'cut', 'paste', 'abort', 'auxclick',
    'beforeinput', 'blur', 'canplay', 'canplaythrough', 'close',
    'compositionend', 'compositionstart', 'compositionupdate', 'contextmenu',
    'cuechange', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover',
    'dragstart', 'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'focusin',
    'focusout', 'formdata', 'gotpointercapture', 'invalid', 'keydown', 'keypress',
    'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'lostpointercapture',
    'mouseout', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave',
    'pointermove', 'pointerout', 'pointerover', 'pointerup', 'progress', 'ratechange', 'reset',
    'resize', 'scroll', 'select', 'selectionchange', 'selectstart', 'submit', 'suspend', 'timeupdate',
    'toggle', 'touchcancel',
] as const;

export const events = (() => {
    const map: IJson<any> = {};
    EventNames.map(name => {
        map[name] = on(name);
    });
    return map as {
        [name in (typeof EventNames)[number]]: IEventConstructor
    };
})();


export const [
    click, mousedown, mouseenter, mouseleave, mousemove, mouseover, mouseup, touchend, touchmove, touchstart, wheel, $input, change
] = MainEventNames.map(name => events[name]);