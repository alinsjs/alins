/*
 * @Author: tackchen
 * @Date: 2022-10-23 08:46:52
 * @Description: Coding something
 */
import {div, react, css, style} from '../alins';

export function createCss () {
    const num = react(30);
    (window as any).num2 = num;

    const simpleStyle = style({
        color: '#fff',
        fontSize: react`${num}px`,
    });

    return css('.d-form')(
        // simpleStyle,
        ['&.aa', simpleStyle],
        ['[a=xx]',
            simpleStyle,
            ['&.aa', simpleStyle],
            ['.cc', simpleStyle]
        ],
    );
}

export function StyleComp () {
    const num = react(30);
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
            marginTop: react`${num}px`,
            fontSize: react`${() => num.value}px`
        })),
        div('444', style`
            color: red;
            marginTop: ${num}px;
            fontSize: ${() => num.value}px;
        `),
        div('555',
            style.borderBottom(react`${num}px solid #000`)
                .width(() => num.value + 2)
        ),

        // div('444',
        //     style.borderBottom(reactBuilder), // react builder
        //     style.borderBottom(num), // IReactItem
        //     style.borderBottom(compute), // IComputedItem
        //     style.borderBottom(() => num.value + 1, 'px', 'i'), // TComputedFunc
        //     style.borderBottom(reactBuilder).width(),
        // )
        
    ];
}