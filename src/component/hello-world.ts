/*
 * @Author: tackchen
 * @Date: 2022-10-11 07:21:04
 * @Description: Coding something
 */
function div (...args: any[]): any {
    console.log(args);
}
div.for = function (...args: any[]): any {
    console.log(args);
};
div.if = function (...args: any[]): any {
    console.log(args);
};
div.bind = function (...args: any[]): any {
    console.log(args);
};
 
function span (...args: any[]): any {
    console.log(args);
}
span.if = function (...args: any[]): any {
    console.log(args);
};
function img (...args: any[]): any {
    console.log(args);
}
function i (...args: any[]): any {
    console.log(args);
}
function click (...args: any[]): any {
    console.log(args);
}
function props (...args: any[]): any {
    console.log(args);
}
function comp (...args: any[]): any {
    console.log(args);
}
function input (...args: any[]): any {
    console.log(args);
}
function text (...args: any[]): any {
    console.log(args);
}
span.bind = function (...args: any[]): any {
    console.log(args);
};
function ref (...args: any[]): any {
    console.log(args);
}
function css (...args: any[]): any {
    console.log(args);
}
function react (...args: any[]): any {
    console.log(args);
}
function event (...args: any[]): any {
    console.log(args);
}
function slot (...args: any[]): any {
    console.log(args);
}

export function HelloWorld ({props, slot, event}: any) {
    const onClick = () => {};
    const data = ref({
        msg: '',
        list: []
    });
    return div('.flex-4-num1', click(onClick), [
        span('.flex-4-img', click(event.test), [
            `Hello ${data.msg} ${props.value}`,
            img('.item-img[alt=xxx;lazy=loaded;src=https://shiyix.cn/wx-pay.png]')
        ]),
        slot,
        div('.flex-4-num1-des', [
        ]),
    ]);
}


function ReactiveContent () {
    const data = react({
        msg: 'world',
        value: 100,
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive', [
        div('.reactive-content', react`hello ${data.world}`),
        div(react`.reactive-class.reactive-${data.world}`),
        div(react`.reactive-attr[reactive=${data.world}]`),
        div('.reactive-css', css({
            color: react`rgba(255, ${data.value}, 255)`
        })),
    ]);
}

function ForDemo () {
    const data = react({
        list: [{a: 1}, {a: 2}]
    });
    return div('.reactive', [
    // only content
        div.for(data.list)((item: any) => ['.class', react`:content ${item.a}`]),
        div.for(data.list)((item: any) => [react`.class:content ${item.a}`]),
        // 容器
        div.for(data.list)((item:any) => [
            div([
                span.if(item.name)('.name', [
                    i(':xxxx')
                ])
            ]),
            div('.flex-4-num1-operation', [
                div('.flex-4-num1-play', ':click')
            ]),
            input.bind(data.a)('.input')
        ])
    ]);
}

export function Parent () {
    return div('.parent', [
        ':Hello World',
        text('hello'),
        span(':content'),
        
        comp(HelloWorld, props(), event(), slot()),
        comp(ReactiveContent),
        comp(ForDemo),
    ]);
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