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
export const hello: IComponent = ({prop, event, slot}) => {
    console.log(prop.num);
    watch(prop.num, (v, old) => {
        console.log('hello', v, old);
    });
    (window as any).prop = prop;
    return div(react`:hello-${prop.num}`,
        click(event.add),
        slot.default,
    );
};