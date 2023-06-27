/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:33:41
 * @Description: Coding something
 */

import {IElement} from './renderer';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 16:33:44
 * @Description: Coding something
 */
// export type TEventName = keyof HTMLElementEventMap;

type TEventDecorator = 'prevent' | 'stop' | 'capture' | 'once' | 'self';

// prevent：阻止默认事件（常用）；
// stop：阻止事件冒泡（常用）；
// once：事件只触发一次（常用）；
// capture：使用事件的捕获模式；
// self：只有event.target是当前操作的元素时才触发事件；

export type IEventNames =
    'click'| 'mousedown'| 'mouseenter'| 'mouseleave'| 'mousemove'| 'mouseover'| 'mouseup'|
    'touchend'| 'touchmove'| 'touchstart'| 'wheel'| 'input'| 'change'|
    'fullscreenchange'| 'fullscreenerror'| 'copy'| 'cut'| 'paste'| 'abort'| 'auxclick'|
    'beforeinput'| 'blur'| 'canplay'| 'canplaythrough'| 'close'|
    'compositionend'| 'compositionstart'| 'compositionupdate'| 'contextmenu'|
    'cuechange'| 'dblclick'| 'drag'| 'dragend'| 'dragenter'| 'dragleave'| 'dragover'|
    'dragstart'| 'drop'| 'durationchange'| 'emptied'| 'ended'| 'error'| 'focus'| 'focusin'|
    'focusout'| 'formdata'| 'gotpointercapture'| 'invalid'| 'keydown'| 'keypress'|
    'keyup'| 'load'| 'loadeddata'| 'loadedmetadata'| 'loadstart'| 'lostpointercapture'|
    'mouseout'| 'pause'| 'play'| 'playing'| 'pointercancel'| 'pointerdown'| 'pointerenter'| 'pointerleave'|
    'pointermove'| 'pointerout'| 'pointerover'| 'pointerup'| 'progress'| 'ratechange'| 'reset'|
    'resize'| 'scroll'| 'select'| 'selectionchange'| 'selectstart'| 'submit'| 'suspend'| 'timeupdate'|
    'toggle'| 'touchcancel';

export type IEvent = ((e: Event)=>any) | {
  listener: (e: Event)=>any;
} & {
  [decorator in TEventDecorator]?: boolean;
}

export function addEvent (dom: IElement, name: string, event: IEvent) {
    name = name.substring(2);
    if (typeof event === 'function') {
        dom.addEventListener(name, event);
    } else {
        const handle = (e: Event) => {
            // @ts-ignore
            if (event.self && e.target !== dom) return;
            if (event.stop) e.stopPropagation();
            if (event.prevent) e.preventDefault();
            if (event.once) dom.removeEventListener(name, handle, event.capture);
        };
        dom.addEventListener(name, handle, event.capture);
    }
}