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
                span({click: () => {msg.value = 'xx';}}, [
                    div({})
                ])
            ]
        });
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
  
    const children = list.map(item => {
        return div();
    });

    return div({children});

    
    const children = list.map(() => {
        return '';
    });

    return div({
        children
    });
}

function for2Demo () {
    const list = [1, 2, 3];
  
    let children = [];
    for (const item of list) {
        children.push(div());
    }

    return div({children});

    
    const children = list.map(() => {
        return '';
    });

    return div({
        children
    });
}
function ifDemo () {
    const list = true;
  
    if (list) {
        return div({children});
    }
    return div({children});
}

function ifDemo () {
    const list = true;

    if (list) {
        a = 1;
    }

    if (list) {
        return div();
    }
    return div();

    div({
        children: [
            list ? div() : div
        ]
    });

    return $if(list).then(() => {
        return div();
    }).else(() => {
        return div();
    });
}

function switchDemo () {
    const data = true;
    switch (data) {
        case 1: return div();
        case 2: return div();
        default: return div();
    }

    return $switch(data).case(1, () => {

    }).case(2, () => {
        
    }).default(() => {

    });
}

function main () {

    const data = true;

    return $switch(data).case(1, () => {

    }).case(2, () => {
        
    }).default(() => {

    });


    const data = [1, 2, 3];
  
    const children = list.map(item => {
        return div();
    });

    const data = true;


    (() => {

    })();
    data ? div() : (
        a ? div() : div()
    );

    return $if(list, () => {
        return div();
    }).elseif(a, () => {
        return div();
    });

    return $if(list).then(() => {
        return div();
    }).elseif(a).then(() => {
        return div();
    });
}

dom({
    $tag: '',
    value: data,
});

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

