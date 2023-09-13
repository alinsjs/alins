/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:33:41
 * @Description: Coding something
 */

import { isProxy } from 'alins-reactive';
import { IElement, IFragment, IEventObject, IEventAttributes, IEventObjectDeco } from './alins';

export type IEventNames = keyof IEventAttributes;

export function isEventAttr (dom: IElement|IFragment, name: string, event: IEventObject) {
    if (!name.startsWith('on')) return false;
    if (dom[name] !== null && typeof dom[name] !== 'function') return false;
    // @ts-ignore
    if (
        typeof event !== 'function' &&
        typeof event?.listener !== 'function' &&
        // @ts-ignore
        typeof event?.__deco !== 'string'
    ) return false;
    return true;
}

export function addEvent (dom: IElement, name: string, event: IEventObjectDeco) {
    name = name.substring(2);
    if (typeof event === 'function') {
        dom.addEventListener(name, event);
    } else if (isProxy(event)) {
        // @ts-ignore
        dom.addEventListener(name, event.v);
    } else {
        // @ts-ignore
        if (event.__deco) {
        // @ts-ignore
            const deco = event.__deco.split('-');
            event = {
                // @ts-ignore
                listener: event.v,
            } as IEventObjectDeco;
            for (const name of deco) {
                event[name] = true;
            }
        }
        const handle = (e: Event) => {
            // @ts-ignore
            if (event.self && e.target !== dom) return;
            if (event.stop) e.stopPropagation();
            if (event.prevent) e.preventDefault();
            if (event.once) dom.removeEventListener(name, handle, event.capture);
            event.listener(e);
        };
        dom.addEventListener(name, handle, event.capture);
    }
}