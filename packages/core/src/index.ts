/*
 * @Author: tackchen
 * @Date: 2022-10-23 18:48:50
 * @Description: Coding something
 */
import {
    react, computed, watch, createProxy, $
} from 'alins-reactive';
import {mount} from './mount';
import {
    dom, div, span, input, button, img, a, i, text,
} from './builder/builder';
import {comp} from './comp/comp';
import {prop} from './comp/prop';
import {event} from './comp/event';
import {slot} from './comp/slot';
import {on, click} from './event/on';

export {mount} from './mount';

export {
    IElement,
} from './element/transform';

export {
    dom, div, span, input, button, img, a, i, text,
} from './builder/builder';
export {comp, IComponent, IComponentOptions} from './comp/comp';
export {prop} from './comp/prop';
export {event} from './comp/event';
export {slot} from './comp/slot';
export {on, click} from './event/on';

export {
    react, computed, watch, createProxy, $,
} from 'alins-reactive';

export {IReactItem} from 'alins-utils/src/types/react';

export default {
    mount,
    text, dom, div, span, input, button, img, a, i, // todo add
    react, computed, watch, createProxy, $,
    comp, prop, slot, event,
    on, click, // todo add
};