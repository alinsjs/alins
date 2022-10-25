/*
 * @Author: tackchen
 * @Date: 2022-10-23 22:03:31
 * @Description: Coding something
 */

import {
    span, input, div, $, css, style
} from '../alins';

export function Style2 () {
    const size = $(12);
    const color = $('#222');

    initCss(size, color);

    return [
        div(
            span('修改size:'),
            input.model(size, 'number'),
        ),
        div(
            span('修改颜色:'),
            input.model(color),
        ),
        div('文本', style({
            color, fontSize: size
        })),
        div('.parent',
            div('.child:文本2')
        )
    ];
}

function initCss (size: any, color: any) {
    return css('.parent')(
        style.borderBottom($`${size}px solid ${color}`),
        ['.child',
            style({color, fontSize: size})
        ]
    ).mount();
}

export function StyleAtom () {
    const size = $(12);
    const color = $('#222');

    return [
        div('Style Atom',
            style.color('#f44').fontSize(20),
        ),
        div(
            span('修改size:'),
            input.model(size, 'number')(),
        ),
        div(
            span('修改颜色:'),
            input.model(color)(),
        ),
        div('Style React',
            style.color(color).fontSize(size),
        )
    ];
}

// document.styleSheets[0].cssRules[0].cssText;
