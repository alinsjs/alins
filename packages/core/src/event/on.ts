/*
 * @Author: tackchen
 * @Date: 2022-10-17 16:33:44
 * @Description: Coding something
 */
// export type TEventName = keyof HTMLElementEventMap;

import {IBuilderParameter, IJson} from 'alins-utils';

type TEventDecorator = 'prevent' | 'stop' | 'capture' | 'once' | 'self';

export interface IEventBuilder extends IBuilderParameter {
    args(...args: any[]): IEventBuilder;
    exe(dom: HTMLElement): void;
    type: 'on';
    name: string;
}

export interface IOnListener {
    (...args: any[]): void,
    // ? 没办法指定后面类型 不生效
    // (...args: [...any[], Event, HTMLElement]): void,
}

export interface IEventConstructor {
    (
        listener: IOnListener,
        ...decorators: TEventDecorator[]
    ): IEventBuilder;
    stop: IEventBuilder;
    prevent: IEventBuilder;
}

// prevent：阻止默认事件（常用）；
// stop：阻止事件冒泡（常用）；
// once：事件只触发一次（常用）；
// capture：使用事件的捕获模式；
// self：只有event.target是当前操作的元素时才触发事件；


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

type TEventNames = typeof EventNames[number];

function createEventBuilder (name: TEventNames, listener: IOnListener|null, decorators: TEventDecorator[]) {
    const eventArgs: any[] = [];
    return {
        args (...args) {
            eventArgs.push(...args);
            return this;
        },
        exe (dom: HTMLElement) {
            if (decorators.length === 0) {
                if (listener)
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
                    if (listener)listener.apply(dom, [...eventArgs, e]);
                    if (is('once')) dom.removeEventListener(name, handle, useCapture);
                };
                dom.addEventListener(name, handle, useCapture);
            }
        },
        type: 'on',
        name,
    } as IEventBuilder;
}

export function on (
    name: TEventNames
): IEventConstructor {
    return Object.assign((
        listener: IOnListener,
        ...decorators: TEventDecorator[]
    ) => {
        return createEventBuilder(name, listener, decorators);
    }, {
        prevent: createEventBuilder(name, null, ['prevent']),
        stop: createEventBuilder(name, null, ['stop']),
    });

}

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