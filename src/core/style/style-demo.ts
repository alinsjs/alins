/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */
import {div} from '../builder/builder';
import {computed} from '../reactive/computed';
import {react} from '../reactive/react';
import {css, style} from './style';


style({
    color: '#fff',
    fontSize: '10px',
});

style({
    color: '#fff',
    fontSize: react`${() => 1}px`
});

style`
    color: '#fff',
    fontSize: 10px
`;

style(`
    color: '#fff',
    fontSize: 10px
`);

style`
    color: '#fff',
    fontSize: ${() => 1}px
`;

const simpleStyle = style({
    color: '#fff',
    fontSize: '10px',
});


css('.d-form')(
    simpleStyle,
    css('&.aa')(simpleStyle),
    ['&.aa', simpleStyle],
    css('*')(simpleStyle),
    ['*', simpleStyle],
);

style.paddingTop(10);

/**
 * 原子属性
 * 屏蔽兼容写法
 * 积木式组合使用
 * 响应数据
 */

css('.d-form')(
    ['*', style.borderBox()],
    style.borderBox()
        .fontSize(17)
        .width(80, '%')
        .margin('0 auto')
        .maxWidth(500),
    ['.d-form-item-w',
        style.padding(9, 0)
            .borderBottom('1px dashed #ccc;'),
        ['&:last-child',
            style.border('none')
        ],
        ['.d-form-item-title',
            style.marginBottom(5),
            ['.d-form-item-tip',
                style.color('#aaa')
                    .marginLeft(10)
                    .fontSize(14),
                css('&.d-form-item-necessary')(
                    style.color('#aaa')
                )
            ]
        ]
    ]
);

const num = react('1');

const reactBuilder = react`${() => num.value + 1}`;
const compute = computed(() => num.value + 1);

div(
    style.borderBottom(reactBuilder), // react builder
    style.borderBottom(num), // IReactItem
    style.borderBottom(compute), // IComputedItem
    style.borderBottom(() => num.value + 1), // TComputedFunc
    style({
        color: '#fff',
        fontSize: react`${() => 1}px`
    }),
    style`
        color: '#fff',
        fontSize: ${() => 1}px
    `,
    style.borderBottom(() => 1),
);


/* css*/`.d-form{
    *{
        box-sizing: border-box;
    }
    box-sizing: border-box;
    font-size: 17px;
    width: 80%;
    margin: 0 auto;
    max-width: 500px;
    min-width: 320px;
    padding-top: 10px;
    .d-form-item-w{
        padding: 8px 0;
        border-bottom: 1px dashed #ccc;
        &:last-child{
            border: none;
        }
        .d-form-item-title{
            margin-bottom: 5px;
            .d-form-item-tip{
                color: #aaa;
                margin-left: 10px;
                font-size: 14px;
                &.d-form-item-necessary{
                    color: #f44;
                }
            }
        }
    }
}`;