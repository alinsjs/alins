import {div} from './core/builder/builder';
import {IComponent} from './core/comp/comp';
import {click} from './core/event/on';
import {react} from './core/reactive/react';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 22:00:45
 * @Description: Coding something
 */
export const hello: IComponent = ({props, events, slots}) => {
    console.log(props.num);
    (window).props = props;
    return div(react`:hello-${props.num}`,
        click(events.add),
        slots.default,
    );
};