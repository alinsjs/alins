/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 02:33:48
 * @Description: Coding something
 */

import {
    div, react, comp, button,
    click, prop,
} from '../alins';
import {CountProps} from './count';

export function FuncBuilder () {
    return div(() => {
        const count = react(1);
        return [
            button('add', (click(() => count.value ++))),
            comp(CountProps, prop({value: count})),
            comp(CountProps, prop({value: count})),
        ];
    });
}