/*
 * @Author: tackchen
 * @Date: 2022-10-11 07:21:04
 * @Description: Coding something
 */

import {button, div, i, img, input, span, text} from 'src/core/builder/builder';
import {comp} from 'src/core/comp/comp';
import {event} from 'src/core/comp/event';
import {prop} from 'src/core/comp/prop';
import {slot} from 'src/core/comp/slot';
import {click} from 'src/core/event/on';
import {react} from 'src/core/reactive/react';

export function HelloWorld ({props, slots, events}: any) {
    const onClick = () => {
        console.log('onClick');
    };
    const data = react({
        msg: '',
        list: [],
        src: 'https://shiyix.cn/wx-pay.png'
    });
    const switchSrc = () => {
        data.src = 'https://img0.baidu.com/it/u=3380674861,1672768141&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400';
    };
    return div('.flex-4-num1', click(onClick),
        span('.flex-4-img', click(events.test),
            react`Hello ${data.msg} ${props.value}`,
            img(react`.item-img[width=100][alt=xxx][lazy=loaded][src=${data.src}]`)
        ),
        button('切换图片', click(switchSrc)),
        slots.default,
        div('.flex-4-num1-des'),
    );
}


function ReactiveContent () {
    const data = react({
        msg: 'world',
        value: 100,
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive',
        div('.reactive-content', react`hello ${data.msg}`),
        div(react`.reactive-class.reactive-${data.msg}`),
        div(react`.reactive-attr[reactive=${data.msg}]`),
        div('.reactive-css'),
        input.model(data.msg)('.input'),
    );
}

function ForDemo () {
    const data = react({
        input: 'test',
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive',
    // only content
        div.for(data.list)((item) => ['.class', react`:content ${item.a}`]),
        div.for(data.list)((item) => [react`.class:content ${item.a}`]),
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
        text('Hello World'),
        span(':content'),
        comp(HelloWorld, prop({
            value: '11',
        }), event({
            test: () => console.log('test event')
        }), slot(div(':slot'))),
        comp(ReactiveContent),
        comp(ForDemo),
    );
}

// return `
// div.flex-4-num1@click{onClick}
//     @on:hover{onHover}
//     span.flex-4-img
//         Hello {ref.msg}{props.value}
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