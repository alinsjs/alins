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
    dom, text, doms,
    a, div, h1, h2, h3, h4, h5, h6, button, canvas, code, pre, table, th, td, tr, video, audio, ol, select, option, p, i, iframe, img, input, label, li, span, textarea, form
} from './builder/builder';
import {comp} from './comp/comp';
import {prop} from './comp/prop';
import {event} from './comp/event';
import {slot} from './comp/slot';
import {
    events, on,
    click, mousedown, mouseenter, mouseleave, mousemove, mouseover, mouseup, touchend, touchmove, touchstart, wheel, $input, change
} from './event/on';

import {
    life, mounted, updated, created, appended, removed
} from './builder/life';
export {
    life, mounted, updated, created, appended, removed
} from './builder/life';

export {mount} from './mount';

export {
    IElement,
} from './element/transform';

export * from './builder/builder';
export {comp, IComponent, IComponentOptions} from './comp/comp';
export {prop} from './comp/prop';
export {event} from './comp/event';
export {slot} from './comp/slot';
export * from './event/on';

export {
    react, computed, watch, createProxy, $,
} from 'alins-reactive';

export {IReactItem} from 'alins-utils/src/types/react.d';

export default {
    mount,
    dom, text, doms,
    a, div, h1, h2, h3, h4, h5, h6, button, canvas, code, pre, table, th, td, tr, video, audio, ol, select, option, p, i, iframe, img, input, label, li, span, textarea, form,
    react, computed, watch, createProxy, $,
    comp, prop, slot, event,
    events, on,
    click, mousedown, mouseenter, mouseleave, mousemove, mouseover, mouseup, touchend, touchmove, touchstart, wheel, $input, change,
    life, mounted, updated, created, appended, removed
};