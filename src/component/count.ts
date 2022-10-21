import {button} from 'src/core/builder/builder';
import {click} from 'src/core/event/on';
import {react} from 'src/core/reactive/react';

/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
export function count () {
    const count = react(0);
    return button(
        click(() => {count.value++;}),
        react`:Count is ${count}`
    );
}