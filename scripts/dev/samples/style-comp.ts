/*
 * @Author: tackchen
 * @Date: 2022-10-23 08:46:52
 * @Description: Coding something
 */
import {
    div, $, css, style, computed, pseudo,
    button, hover, click, input, cls, after, span
} from '../alins';

const num = $(30);

const hoverEle = hover(
    'color: #f44;', // 字符串
    style({fontSize: num}), // StyleBuiler
    style.paddingLeft(num).relative().left(num), // 原子样式
    $`padding-top: ${num}px;` // 响应式字符串
);

const afterEle = after(style.content('"after element"').color('#4f4'));

div(
    span('修改num: '),
    input.model(num, 'number'),
    div('Mouse hover me', hoverEle, afterEle),
).mount();

function createCss () {
    const num = $(30);
    (window as any).num2 = num;

    const simpleStyle = style({
        color: '#888',
        fontSize: $`${num}px`,
    });

    return css()(
        $`@keyframes aa {
            ${simpleStyle},
        }`,
        simpleStyle,
        ['&.aa', simpleStyle],
        ['[a=xx]',
            simpleStyle,
            ['&.aa', simpleStyle],
            ['.cc', simpleStyle]
        ],
    ).mount();
}

export function StyleDemo () {
    const num = $(30);
    const active = $(false);

    css('.main')(
        style({
            color: '#888',
            marginLeft: $`${num}px`,
        }),
        ['&.active', style.fontSize(num)],
        ['.child', style.marginTop(num)]
    ).mount();

    return div(`parent.main`,
        cls({active}),
        hover('color: #f44'),
        input.model(num, 'number'),
        button('toggle active', click(() => active.value = !active.value)),
        div('child.child'),
    );
}

export function StyleComp () {
    createCss();
    const num = $(30);
    (window as any)._style_comp_num = num;
    
    return [
        div('d-form.d-form',
            div('d-form-aa.aa',

            ),
            div('a=yy[a=yy]',
                div('cc.cc')
            ),
            div('a=xx[a=xx].aa',
                div('cc.cc')
            )
        ),
        div('111', style('color: red; font-size: 10px')),
        div('222', style({
            color: 'red',
            fontSize: '10px',
        })),
        div('333', style({
            color: 'red',
            marginTop: $`${num}px`,
            fontSize: $`${() => num.value}px`
        })),
        div('444', style`
            color: red;
            marginTop: ${num}px;
            fontSize: ${() => num.value}px;
        `),
        div('555',
            style.borderBottom($`${num}px solid #000`)
                .width(() => num.value + 2)
                .cursorUrl('aaa', '111')
                .relative().top(3),
            // .animation(keyframe)
        ),

        div('666', pseudo('nth-child', num)(
            $`width: ${num}px;`,
            style.borderBottom($`${num}px solid #000`),
            style.borderBox(),
        ), pseudo('hover')(
            style.borderBottom($`${num}px solid #000`),
            style.borderBox(),
        )),

        div('444',
            style.borderBottom($`${num}px solid`) // react builder
                .fontSize(num) // IReactItem
                .marginLeft(computed(() => num.value + 1)) // IComputedItem
                .marginTop(() => num.value + 1, 'px', 'i') // TComputedFunc
                .marginRight(10)
                .marginBottom('10px')
        )
        
    ];
}