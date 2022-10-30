/*
 * @Author: tackchen
 * @Date: 2022-10-11 07:21:04
 * @Description: Coding something
 */

import {
    button, div, i, img, input, span,
    comp, event, prop, slot, click, $, IComponentOptions
} from '../alins';


function ReactiveContent () {
    const data = $({
        msg: 'world',
        value: 100,
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive',
        div('.reactive-content', $`hello ${data.msg}`),
        div($`.reactive-class.reactive-${data.msg}`),
        div($`.reactive-attr[reactive=${data.msg}]`),
        div('.reactive-css'),
        input.model(data.msg)('.input'),
    );
}

function ForDemo () {
    const data = $({
        input: 'test',
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive',
    // only content
        div.for(data.list)((item) => ['.class', $`:content ${item.a}`]),
        div.for(data.list)((item) => [$`.class:content ${item.a}`]),
        // 容器
        div.for(data.list)((item) => [
            div(
                span.if(item.name)('.name', i(':xxxx'))
            ),
            div('.flex-4-num1-operation',
                div('.flex-4-num1-play', ':click')
            ),
            input.model(item.a)('.input'),
            input.model(data.input)('.input')
        ])
    );
}

export function Parent () {
    return div('.parent',
        'Hello World',
        span('content'),
        comp(HelloWorld, prop({
            value: '11',
        }), event({
            test: () => console.log('test event')
        // }), slot(div('slot'))),
        }), slot((childProp) => div($`slot-${childProp}`))),
        comp(ReactiveContent),
        comp(ForDemo),
    );
}

function HelloWorld ({props, slots, events}: IComponentOptions) {
    const onClick = () => {
        console.log('onClick');
    };
    const data = $({
        msg: '1',
        list: [],
        src: 'https://shiyix.cn/wx-pay.png'
    });
    const switchSrc = () => {
        data.src = 'https://img0.baidu.com/it/u=3380674861,1672768141&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400';
    };
    return div('.flex-4-num1', click(onClick),
        span('.flex-4-img', click(events.test),
            $`Hello ${data.msg} ${props.value}`, // todo fix
            img('aa[width=100][src=https://shiyix.cn/wx-pay.png]'),
            img($`.item-img[width=100][alt=xxx][lazy=loaded][src=${data.src}]`)
        ),
        button('切换图片', click(switchSrc)),
        div('test-slot*********'),
        input.model(data.msg)(),
        slots(data.msg),
        div('.flex-4-num1-des'),
    );
}

export function testLife () {
    return null;
}

// return `
// div.flex-4-num1@click{onClick}
//     @on:hover{onHover}
//     span.flex-4-img
//         Hello {ref.msg}{prop.value}
//         img.item-img[alt=xxx;lazy=loaded;src=https://shiyix.cn/wx-pay.png]
//     {slot}
//     div.flex-4-num1-des
//         div$for{list}.for-item
//             span$if{$item.name}.name@click{onclick}
//                 i:textdsa
//         div.flex-4-num1-operation
//             div.flex-4-num1-play:click
//         input$bind{data.a}.input
// `