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

const cc = comp(CountProps);

function CompController () {
    const list = [1, 2, 3];
    const num = -1;
    const value = 0;
    const value1 = 1;
    const value2 = 2;

    for(i of list){

    }
    
    return [
        span('修改num:'),
        input('[type=number]', model(num)),
        div('comp for demo:'),
        for(list, 'item')(
            cc(prop({value: item}))
        ),
        div('comp if demo:'),
        if(num>1, cc(prop({value}))
            .elif(num<0, cc(prop({value: value1})))
            .else(cc(prop({value: value2}))),
        cc(
            if(num>1, prop({value})
            .elif(num<0, prop({value: value1}))
            .else(prop({value: value2})),
        )
        div('comp switch demo:'),
        switch(num,
            case(0, cc(prop({value: value}))),
            case(1, cc(prop({value: value}))),
            case(2, cc(prop({value: value}))),
        )
        cc.switch(num)
            .case(0)(prop({value: value}))
            .case(1)(prop({value: value1}))
            .case(2)(prop({value: value2})),
        div('comp show demo:'),
        show(num > 1, cc(prop({value: value}))
    ];
}

export function CompController () {
    const list = $([1, 2, 3]);
    const num = $(-1);
    const value = $(0);
    const value1 = $(1);
    const value2 = $(2);
    // const array = $([1, 2]);
    window.__num = num;
    
    return [
        span('修改num:'),
        input.model(num)('[type=number]'),
        div('comp for demo:'),
        
        cc.for(list)((item) => [
            prop({value: item})
        ]),
        div('comp if demo:'),
        cc.if(() => num.value > 1)(prop({value}))
            .elif(() => num.value < 0)(prop({value: value1}))
            .else(prop({value: value2})),
        div('comp switch demo:'),
        cc.switch(num)
            .case(0)(prop({value: value}))
            .case(1)(prop({value: value1}))
            .case(2)(prop({value: value2})),
        div('comp show demo:'),
        cc.show(() => num.value > 1)(prop({value: value})),
    ];
}

// function hello () {
//     return div('hello');
// }