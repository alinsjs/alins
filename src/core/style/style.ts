/*
 * @Author: tackchen
 * @Date: 2022-10-18 09:52:03
 * @Description: Coding something
 */

const style: any = () => {};
const react: any = () => {};
const num: any = 1;

style({
    color: '#fff',
    fontSize: '10px',
});

style({
    color: '#fff',
    fontSize: react`${num}px`
});

style`
    color: '#fff',
    fontSize: 10px
`;

style`
    color: '#fff',
    fontSize: ${num}px
`;

const simpleStyle = style({
    color: '#fff',
    fontSize: '10px',
});

style('.d-form')(
    simpleStyle,
    style('&.aa')(simpleStyle),
    ['&.aa', simpleStyle],
    style('*')(simpleStyle),
    ['*', simpleStyle],
);

style.paddingTop(10);

/**
 * 原子属性
 * 屏蔽兼容写法
 * 积木式组合使用
 * 响应数据
 */

style('.d-form')(
    ['*', style.borderBox()],
    style.borderBox()
        .fontSize(17)
        .width(80, '%')
        .margin('0 auto')
        .maxWidth(500),
    style('.d-form-item-w')(
        style.padding(8, 0)
            .borderBottom('1px dashed #ccc;'),
        style('&:last-child')(
            style.border('none')
        ),
        style('.d-form-item-title')(
            style.marginBottom(5),
            style('.d-form-item-tip')(
                style.color('#aaa')
                    .marginLeft(10)
                    .fontSize(14),
                style('&.d-form-item-necessary')(
                    style.color('#aaa')
                )
            )
        )
    )
);

style('.d-form')(
    ['*', style.borderBox()],
    style.borderBox()
        .fontSize(17)
        .width(80, '%')
        .margin('0 auto')
        .maxWidth(500),
    ['.d-form-item-w',
        style.padding(8, 0)
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
                ['&.d-form-item-necessary',
                    style.color('#aaa')
                ]
            ]
        ]
    ]
)

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