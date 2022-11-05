/*
 * @Author: tackchen
 * @Date: 2022-10-24 08:22:22
 * @Description: Coding something
 */

import {$, comp, span, input, prop, style, div, IComponent} from '../alins';
import {CountProps} from './count';

// export const CompDemo: IComponent = () => {
//     return [
//         null,
//         style({}),
//     ];
// }

export function CompController () {
    const list = $([1, 2, 3]);
    const num = $(-1);
    const value = $(0);
    const value1 = $(1);
    const value2 = $(2);
    // const array = $([1, 2]);
    return [
        span('修改num:'),
        input.model(num, 'number'),
        div('comp for demo:'),
        comp.for(list)((item) => [
            CountProps,
            prop({value: item})
        ]),
        div('comp if demo:'),
        comp.if(() => num.value > 1)(CountProps, prop({value}))
            .elif(() => num.value < 0)(CountProps, prop({value: value1}))
            .else(CountProps, prop({value: value2})),
        div('comp switch demo:'),
        comp.switch(num)
            .case(0)(CountProps, prop({value: value}))
            .case(1)(CountProps, prop({value: value1}))
            .case(2)(CountProps, prop({value: value2})),
        div('comp show demo:'),
        comp.show(() => num.value > 1)(CountProps, prop({value: value})),
    ];
}

// function hello () {
//     return div('hello');
// }