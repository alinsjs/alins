/*
 * @Author: tackchen
 * @Date: 2022-10-23 18:48:50
 * @Description: Coding something
 */


export {value, subscribe, forceUpdate, index, json, getListeners} from 'alins-utils';

export {attr, cls} from './builder/dom-info';
export {
    life, mounted, updated, created, appended, removed
} from './builder/life';

export {mount} from './mount';

export {
    IElement,
} from './builder/builder';

export * from './builder/builder';
export {html} from './builder/html';
export {text} from './builder/text';
export {comp, IComponent, IComponentOptions, IComponentBuilder} from './comp/comp';
export {prop, IProp} from './comp/prop';
export {event, IEvent} from './comp/event';
export {slot, ISlot} from './comp/slot';
export {compControllers} from './controller/controller';
export * from './event/on';

export {
    react, computed, watch, createProxy, $,
} from 'alins-reactive';

export {IReactItem, IReactObject, IReactWrap, IComputedItem} from 'alins-utils';

export {version} from '../package.json';
