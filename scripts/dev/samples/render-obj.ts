/*
 * @Author: tackchen
 * @Date: 2022-10-24 07:30:54
 * @Description: Coding something
 */
import {div, react} from '../alins';

export function renderObject () {
    const data = react({
        a: {
            b: 'ab',
            c: {d: 'acd'}
        },
    });
    return div('.x0#app',
        react`value=${data.a.b}-${data.a.c.d}`,
    );
}