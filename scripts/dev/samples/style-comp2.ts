/*
 * @Author: tackchen
 * @Date: 2022-10-23 22:03:31
 * @Description: Coding something
 */

import {
    span, input, div, react, css, style
} from '../alins';

export function Style2 () {
    const size = react(12);
    const color = react('#222');

    initCss(size, color);

    return ([
        div(
            span('修改size:'),
            input.model(size, 'number')(),
        ),
        div(
            span('修改颜色:'),
            input.model(color)(),
        ),
        div('文本', style({
            color, fontSize: size
        })),
        div('.parent',
            div('.child:文本2')
        )
    ]);
}

function initCss (size: any, color: any) {
    return css('.parent')(
        style.borderBottom(react`${size}px solid ${color}`),
        ['.child',
            style({color, fontSize: size})
        ]
    ).mount();
}

