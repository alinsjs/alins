/*
 * @Author: tackchen
 * @Date: 2022-10-24 08:22:22
 * @Description: Coding something
 */

import {$, button, div, span, input, click, comp} from '../alins';

export function Controller () {

    const num = $(-1);
    // const array = $([1, 2]);
    const add = () => {num.value++;};
    return div(
        $`number=${num}`,
        button('+1', click(add)),
        div('if1----'),
        span.if(() => num.value > 1)($`:if-${num}`)
            .elif(() => num.value < 0)($`/div:elif-${() => num.value + 1}`)
            .else($`/div:${num}`),
        div('input----'),
        input.model(num, 'number')(),
        div('show----'),
        div.show(() => num.value > 0)('show comp'),
        comp(() => div('comp show')).show(() => num.value > 0)(),
        div('if2----'),
        span.if(() => num.value > 1)($`/div:if-${num}`)
            .elif(() => num.value < 0)($`/div:elif-${num}`),
        div('switch----'),
        div.switch(num)
            .case(1)($`:case1-${num}`)
            .case(2)($`:case2-${num}`)
            // .default($`default-${num}`)
            
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
