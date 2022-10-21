import {button, div} from 'src/core/builder/builder';
import {comp, IComponent, IComponentOptions} from 'src/core/comp/comp';
import {click} from 'src/core/event/on';
import {react} from 'src/core/reactive/react';

/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
export const Count: IComponent = () => {
    // const count = react(0);
    return comp(Count2);
};
export function Count2 () {
    const count = react(0);
    return button(
        click(() => {count.value++;}),
        react`:Count deep is ${count}`
    );
}


export function CountProps ({props}: IComponentOptions) {
    return div(
        react`:Count is ${props.count}`
    );
}