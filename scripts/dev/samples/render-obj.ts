/*
 * @Author: tackchen
 * @Date: 2022-10-24 07:30:54
 * @Description: Coding something
 */
import {div, $} from '../alins';

export function renderObject () {
    const data = $({
        a: {
            b: 'ab',
            c: {d: 'acd'}
        },
    });
    return div('.x0#app',
        $`value=${data.a.b}-${data.a.c.d}`,
    );
}