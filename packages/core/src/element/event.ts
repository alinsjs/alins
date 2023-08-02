/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 22:33:41
 * @Description: Coding something
 */

import {IElement, IFragment} from './renderer';
import {IEventObject, IEventAttributes, IEventObjectDeco} from './jsx';

export type IEventNames = keyof IEventAttributes;

export function isEventAttr (dom: IElement|IFragment, name: string, event: IEventObject) {
    debugger;
    if (!name.startsWith('on')) return false;
    if (dom[name] !== null && typeof dom[name] !== 'function') return false;
    // @ts-ignore
    if (
        typeof event !== 'function' && 
        typeof event?.listener !== 'function' &&
        typeof event?.__deco !== 'string'
    ) return false;
    return true;
}

export function addEvent (dom: IElement, name: string, event: IEventObjectDeco) {
    name = name.substring(2);
    if (typeof event === 'function') {
        dom.addEventListener(name, event);
    } else {
        if(event.__deco){
            const deco = event.__deco.split('-')
            event = {
                listener: event.v,
            } as IEventObjectDeco;
            for(let name of deco){
                event[name] = true;
            }
        }
        const handle = (e: Event) => {
            if (event.self && e.target !== dom) return;
            if (event.stop) e.stopPropagation();
            if (event.prevent) e.preventDefault();
            if (event.once) dom.removeEventListener(name, handle, event.capture);
            event.listener(e);
        };
        dom.addEventListener(name, handle, event.capture);
    }
}