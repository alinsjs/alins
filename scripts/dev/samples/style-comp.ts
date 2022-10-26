/*
 * @Author: tackchen
 * @Date: 2022-10-23 08:46:52
 * @Description: Coding something
 */
import {pseudo} from 'packages/style/src/pseudo';
import {div, $, css, style} from '../alins';

function createCss () {
    const num = $(30);
    (window as any).num2 = num;

    const simpleStyle = style({
        color: '#888',
        fontSize: $`${num}px`,
    });

    return css()(
        $`@keyframes aa {
            ${simpleStyle}
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

export function StyleComp () {
    createCss();
    const num = $(30);
    (window as any).num = num;
    
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
            // animation: keyframe
        })),
        div('444', style`
            color: red;
            marginTop: ${num}px;
            fontSize: ${() => num.value}px;
        `),
        div('555',
            style.borderBottom($`${num}px solid #000`)
                .width(() => num.value + 2)
                // .animation(keyframe)
        ),

        div('666', pseudo('nth-child', num)(
            $`width: ${num}px;`,
            style.borderBottom($`${num}px solid #000`),
            style.borderBox(),
        ), pseudo('hover')(
            style.borderBottom($`${num}px solid #000`),
            style.borderBox(),
        ))

        // div('444',
        //     style.borderBottom(reactBuilder), // $ builder
        //     style.borderBottom(num), // IReactItem
        //     style.borderBottom(compute), // IComputedItem
        //     style.borderBottom(() => num.value + 1, 'px', 'i'), // TComputedFunc
        //     style.borderBottom(reactBuilder).width(),
        // )
        
    ];
}