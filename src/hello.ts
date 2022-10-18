import {div} from './core/builder/builder';
import {IComponent} from './core/comp/comp';
import {click} from './core/event/on';
import {react} from './core/reactive/react';
import {watch} from './core/reactive/watch';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 22:00:45
 * @Description: Coding something
 */
export const hello: IComponent = ({props, events, slots}) => {
    console.log(props.num);
    watch(props.num, (v, old) => {
        console.log('hello', v, old);
    });
    (window as any).props = props;
    return div(react`:hello-${props.num}`,
        click(events.add),
        slots.default,
    );
};