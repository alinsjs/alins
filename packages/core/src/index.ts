/*
 * @Author: tackchen
 * @Date: 2022-10-23 18:48:50
 * @Description: Coding something
 */

export {value, subscribe, forceUpdate, index, json} from 'alins-utils';

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
export {comp, IComponent, IComponentOptions} from './comp/comp';
export {prop} from './comp/prop';
export {event} from './comp/event';
export {slot} from './comp/slot';
export * from './event/on';

export {
    react, computed, watch, createProxy, $,
} from 'alins-reactive';

export {IReactItem, IReactObject, IReactWrap, IComputedItem} from 'alins-utils/src/types/react.d';

export {version} from '../package.json';
