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
    'onclick'| 'onmousedown'| 'onmouseenter'| 'onmouseleave'| 'onmousemove'| 'onmouseover'| 'onmouseup'|
    'ontouchend'| 'ontouchmove'| 'ontouchstart'| 'onwheel'| 'oninput'| 'onchange'|
    'onfullscreenchange'| 'onfullscreenerror'| 'oncopy'| 'oncut'| 'onpaste'| 'onabort'| 'onauxclick'|
    'onbeforeinput'| 'onblur'| 'oncanplay'| 'oncanplaythrough'| 'onclose'|
    'oncompositionend'| 'oncompositionstart'| 'oncompositionupdate'| 'oncontextmenu'|
    'oncuechange'| 'ondblclick'| 'ondrag'| 'ondragend'| 'ondragenter'| 'ondragleave'| 'ondragover'|
    'ondragstart'| 'ondrop'| 'ondurationchange'| 'onemptied'| 'onended'| 'onerror'| 'onfocus'| 'onfocusin'|
    'onfocusout'| 'onformdata'| 'ongotpointercapture'| 'oninvalid'| 'onkeydown'| 'onkeypress'|
    'onkeyup'| 'onload'| 'onloadeddata'| 'onloadedmetadata'| 'onloadstart'| 'onlostpointercapture'|
    'onmouseout'| 'onpause'| 'onplay'| 'onplaying'| 'onpointercancel'| 'onpointerdown'| 'onpointerenter'| 'onpointerleave'|
    'onpointermove'| 'onpointerout'| 'onpointerover'| 'onpointerup'| 'onprogress'| 'onratechange'| 'onreset'|
    'onresize'| 'onscroll'| 'onselect'| 'onselectionchange'| 'onselectstart'| 'onsubmit'| 'onsuspend'| 'ontimeupdate'|
    'ontoggle'| 'ontouchcancel';

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