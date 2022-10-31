/*
 * @Author: tackchen
 * @Date: 2022-10-23 18:48:50
 * @Description: Coding something
 */

export {attr, cls} from './builder/dom-info';
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

export {version} from '../package.json';
