/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 19:28:09
 * @Description: Coding something
 */
function HelloWorld () {
    return div('');
}


function HelloWorld () {
    const msg = $('Hello World');
    const show = $(false);
    div.if(show)();
    if (show) {
        return div({
            style: {},
            class: `${show ? 'aa' : msg.value}`,
            onclick: () => {msg.value = 'xx';},
            $life: {},
            $html: '',
            $child: [

            ]
        }, [
            span({click: () => {msg.value = 'xx';}}, [
                div({})
            ])
        ]);
    }
    return null;
}

function HelloWorld () {
    let msg = 'Hello World';
    const show = false;
    if (show) {
        return div({
            html: '',
            text: '',
            style: {},
            class: `${show ? 'aa' : msg}`,
            placeholder: {
                value: $`${a}-1`,
                enabled: true,
            },
            onclick: {
                listener: () => {msg = 'xx';},
            },
            children: [
                span({click: () => {msg = 'xx';}}, [
                    div({})
                ])
            ]
        });
    }
    return null;
}

function forDemo () {
    const list = [1, 2, 3];
  
    const children = [];

    for (const i in list) {
        children.push(div(i));
    }

    return div({children});
}
function forDemo2 () {
    const list = [1, 2, 3];
    return div({
        children: list.map(i => div(i)),
    });
}

function HelloWorld () {
    let msg = 'Hello World';
    let show = false;
    setTimeout(() => {
        show = true;
    }, 2000);
    if (show) {
        return div({
            html: msg,
            click: () => {msg = 'xx';}
        });
    }
    return null;
}

// ==>

function HelloWorld () {
    let msg = 'Hello World';
    let show = false;
    setTimeout(() => {
        show = true;
    }, 2000);

    const div = document.createElement('div');
    div.innerHTML = msg;
    div.addEventListener('click', () => {
        msg = 'xx';
    });


}

