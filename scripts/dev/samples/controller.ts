/*
 * @Author: tackchen
 * @Date: 2022-10-24 08:22:22
 * @Description: Coding something
 */

import {react, button, div, span, input, click} from '../alins';

export function Controller () {

    const num = react(-1);
    // const array = react([1, 2]);
    const a = react`/div:else`;
    const add = () => {num.value++;};
    return div(
        react`number=${num}`,
        button('+1', click(add)),
        // div('if1----'),
        // span.if(() => num.value > 1)(react`:if-${num}`)
        //     .elif(() => num.value < 0)(react`/div:elif-${() => num.value + 1}`)
        //     .else(react`/div:${num}`),
        // div('input----'),
        input.model(num, 'number')(),
        div('if2----'),
        span.if(() => num.value > 1)(react`/div:if-${num}`)
            .elif(() => num.value < 0)(react`/div:elif-${num}`),
        // div('switch----'),
        // div.switch(num)
        //     .case(1)(react`:case1-${num}`)
        //     .case(2)(react`:case2-${num}`)
        //     .default(react`default-${num}`)
            
        
        // comp.if(() => num.value > 1)(hello)
        //     .else('/div:111'),
        // comp.show(() => num.value > 1),
        // comp.switch(num)
        //     .case(1)(hello)
        //     .case(2)(hello),
        // comp.for(array)(hello),
    );
}

// function hello () {
//     return div('hello');
// }