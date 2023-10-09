/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-28 22:19:57
 * @Description: Coding something
 */
export function forFunc () {
    const data = use();

    function use () {
        const $d = { list: [] };
        return $d;
    }

    let bool = false;

    bool = true;

    // todo if 和 for 冲突问题
    return <div id='d1' $$App>
        <If data={data.list.length === 0}>
            {/* <If data={bool}> */}
            <div id='d2'>Console is empty.</div>
        </If>
        <Else>
            <For data={data.list}>
                <div id='d3'>{$item}</div>
            </For>
        </Else>
    </div>;
}

function SyncHeight () {
    let height = 0;

    function syncHeight (el) {
        const ro = new ResizeObserver(() => height = el.offsetHeight);
        ro.observe(el);
        return () => ro.disconnect();
    }

    <div $mount='#App'>
        <textarea $mounted={syncHeight} />
        <div>height is {height}</div>
    </div>;
}

function switchCase () {

    const data = use();

    function use () {
        const $d = { list: [ 1 ] };
        return $d;
    }

    const $n = 0;

    // todo if 和 for 冲突问题

    <div id='d1' $$App>
        <Switch data={data.list.length}>
            <Case data={1} break={false}>
                <div id='d2'>Console is empty.</div>
            </Case>
            <Case data={2}>
                <For data={data.list}>
                    <div id='d3'>1:{$item}</div>
                </For>
            </Case>
            <Case data={3} break={false}>
    3333
            </Case>
            <Case data={4}>
    44444
            </Case>
        </Switch>
    </div>;

}

export function multiIf () {
    let a = 0;

    a ++;

    <div $$App>
    11
        <If data={a < 4}>
        a &lt; 4;
            <If data={a < 3}>
            1: a &lt; 3;
                <If data={a < 2}>
                11: a = 1;
                </If>
                <Else>
                11: a = 2
                </Else>
            </If>
            <Else>
            1: a = 3
            </Else>
        22
        </If>
        <Else>
            <If data={a < 5}>
            2:a = 4
            </If>
            <Else>
            2:a &gt; 6
            </Else>
        </Else>
    </div>;
}


function bench () {


    /*
 * @Author: chenzhongsheng
 * @Date: 2023-08-10 16:07:29
 * @Description: Coding something
 */

    let selected = -1;
    let rows = [];
    function add () {
        rows.push(...buildData());
    }

    // window.selected = () => {
    //     selected;
    //     debugger;
    // };

    function remove (id) {
        rows.splice(
            rows.findIndex((d) => d.id === id),
            1
        );
    }

    function select (id) {
        selected = id;
    }

    function run () {
        rows = buildData(1);
        selected = -1;
    }

    function update () {
        const n = rows.length;
        for (let i = 0; i < n; i += 10) {
            rows[i].label += ' !!!';
        }
    }

    function runLots () {
        rows = buildData(10000);
        console.timeEnd();
    }

    function clear () {
        rows = [];
        selected = -1;
    }

    function swapRows () {
        if (rows.length > 998) {
            const d1 = rows[1];
            rows[1] = rows[998];
            rows[998] = d1;
        }
    }

    document.body.appendChild(<div>
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Alins (non-keyed)</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="run"
                                onclick={run}
                            >
                Create 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="runlots"
                                onclick={runLots}
                            >
                Create 10,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="add"
                                onclick={add}
                            >
                Append 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="update"
                                onclick={update}
                            >
                Update every 10th row
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="clear"
                                onclick={clear}
                            >
                Clear
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="swaprows"
                                onclick={swapRows}
                            >
                Swap Rows
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data">
            <tbody>
                <For data={rows}>
                    <tr
                        class={{ danger: $item.id === selected }}
                        data-label={$item.label}
                    >
                        <td class="col-md-1">{ $item.id }</td>
                        <td class="col-md-4">
                            <a onclick={() => select($item.id)}>{ $item.label }</a>
                        </td>
                        <td class="col-md-1">
                            <a onclick={() => remove($item.id)}>
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>
                </For>
            </tbody>
        </table>
        <span
            class="preloadicon glyphicon glyphicon-remove"
            aria-hidden="true"
        ></span>
    </div>);


    let _ID = 1;
    function _random (max) {
        return Math.round(Math.random() * 1000) % max;
    }
    function buildData (count = 1000) {
        const adjectives = [
            'pretty',
            'large',
            'big',
            'small',
            'tall',
            'short',
            'long',
            'handsome',
            'plain',
            'quaint',
            'clean',
            'elegant',
            'easy',
            'angry',
            'crazy',
            'helpful',
            'mushy',
            'odd',
            'unsightly',
            'adorable',
            'important',
            'inexpensive',
            'cheap',
            'expensive',
            'fancy'
        ];
        const colours = [
            'red',
            'yellow',
            'blue',
            'green',
            'pink',
            'brown',
            'purple',
            'brown',
            'white',
            'black',
            'orange'
        ];
        const nouns = [
            'table',
            'chair',
            'house',
            'bbq',
            'desk',
            'car',
            'pony',
            'cookie',
            'sandwich',
            'burger',
            'pizza',
            'mouse',
            'keyboard'
        ];
        const data = []; // @static
        for (let i = 0; i < count; i++)
            data.push({
                id: _ID++,
                label:
        adjectives[_random(adjectives.length)] +
        ' ' +
        colours[_random(colours.length)] +
        ' ' +
        nouns[_random(nouns.length)]
            });
        return data;
    }

}

export function watchLabel () {
    let a = 1;
    const $a = { a: 1 };
    // a++;
    const b = a + 1;

    const c = {
        a: a + 2
    };

    watch: $a, (newValue, oldValue) => {
        console.log('a changed:', newValue, oldValue);
    };
    watch: $a.a, (newValue, oldValue) => {
        console.log('a changed:', newValue, oldValue);
    };
    watch: a + 1, (newValue, oldValue) => {
        console.log('a + 1 changed:', newValue, oldValue);
    };
    watch: () => a * 2, (newValue, oldValue) => {
        console.log('a * 2 changed:', newValue, oldValue);
    };
    watch: b, (newValue, oldValue) => {
        console.log('b changed:', newValue, oldValue);
    };
    watch: c, (newValue, oldValue, prop) => {
        console.log('c changed:', newValue, oldValue, prop);
    };

    <button $$App onclick={a++}>Modify A</button>;
}


export function LifeCycle () {
    <div $$App
        $mounted={() => console.log('111')}
        $appended={() => console.log('222')}
        $created={() => console.log('333')}
        $removed={() => console.log('444')}>
111
        <><div $mounted={() => console.log('23232')}></div></>
    </div>;
}

export function dirtyComputed () {
    let a = 1; // @reactive
    const b = a++;

    <div $$App>
        <div>a={a} b={b}</div>
        <button onclick={a++}>add</button>
    </div>;
}

<div $$App>
    <div $if={a === 1}>1</div>
    <div $elseif={a === 2}>2</div>
    <div $else>2</div>
</div>;

static_scope: {
    let name = '';
    name ++;
    const list = [];
    list.push(1);
};
static_scope: if (count) {
    let name = '';
    name ++;
    const list = [];
    list.push(1);
};

_: a = 1;

$: b = 2;


/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-19 09:16:54
 * @Description: Coding something
 */

let a = 1;
a++;

<div $$App>
    <Switch data={a}>
        <Case data={1}>111</Case>
        <div $case={2}>222</div>
    </Switch>

    <div>------</div>


    <div $switch={a}>
        <Case data={1}>111</Case>
        <div $case={2}>222</div>
    </div>
</div>;


const list = [ 1 ];

list.push(2, 3);


<div $$App>
    <div $for={list} $item='aa'>{aa}</div>
</div>;


const list = [ 1 ];

list.push(2, 3);


<div $$App>
    <div $for={list} $item='aa'>{aa}</div>
</div>;


let a = -1;
a++;

<div $$App>
    <If data={a === 0}>0</If>
    <div $elseif={a === 1}>1</div>
    <ElseIf data={a === 2}>2</ElseIf>
    <div $elseif={a === 3}>3</div>
    <Else>4</Else>
</div>;

function mockFetch () {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ name: 'Bob', age: 10 });
        }, 2000);
    });
}

function Component () {
    // You can specify the name of the $data through the name attribute: name='persion'
    return <Async data={mockFetch()}>
        <div>name={$data.name}; age={$data.age}</div>
    </Async>;
}
function Attribute () {
    // You can specify the name of the $data through the name attribute: $name='persion'
    return <div $async={mockFetch()}>name={$data.name}; age={$data.age}</div>;
}
<div $$App>
    <Component/>
    <Attribute/>
</div>;


function Component () {
    const list = [
        { name: 'Bob', age: 10 },
        { name: 'Alice', age: 11 },
        { name: 'Eric', age: 12 },
        { name: 'Tom', age: 13 }
    ];
    const age = 10;
    return <>
        <button onclick={() => {
            const data1 = list[1];
            list[1] = list[2];
            list[2] = data1;
        }}>Switch 1 and 2</button>
        <For data:list>
            <If data={$item.name.startsWith('A')}>
                <div>{$index + 1}: name={$item.name}; age={$item.age};</div>
            </If>
            <Else>
                <div>{$index + 1}:22 name={$item.name}; age={$item.age};</div>
            </Else>
        </For>
    </>;
    // You can specify the name of the $item and $index through the name attribute: item='person' index='i'
}
<Component $$App/>;


function ifBlockPlus () {
    function Main () {
        let count = 0;
        const add = () => {count++;};
        const b = <button onclick={add}> Inc </button>;

        let d1;

        if (count % 3 == 0) {
            console.log('1111');
            d1 = <div id="it">Div1 Now count {count}</div>;
        } else if (count % 3 == 1) {
            d1 = <div id="it">Div2 Now count {count}</div>;
        } else {
            d1 = <div id="it">Div3 Now count {count}</div>;
        }
        console.log(d1);
        d1.appendChild(b);
        return d1;
    }
    <Main $$App/>;
}

function switchBlockPlus () {
    function Main () {
        let count = 0;
        const add = () => {count++;};
        const b = <button onclick={add}> Inc </button>;

        let d1;

        switch (count % 3) {
            case 0: (() => {d1 = <div id="it">Div1 Now count {count}</div>;})(); break;
            case 1: (() => {d1 = <div id="it">Div2 Now count {count}</div>;})(); break;
            default: (() => {d1 = <div id="it">Div3 Now count {count}</div>;})(); break;
        }
        // console.log(d1);
        d1.appendChild(b);
        return d1;
    }
    <Main $$App/>;
}


function lifeLabel () {

    function Component () {
        appended: dom => {
            console.log('111', dom);
        };
        return <div>
        111
            <Comp2></Comp2>
        </div>;
    }

    function Comp2 () {
        mounted: dom => {
            console.log('222', dom);
            return (dom) => {
                console.log('333', dom);
            };
        };
        return <div>22</div>;
    }

    <Component $$App $appended={dom => {
        console.log(11111, dom);
    }}/>;
}

function doubleAnd(){

    let a = false; // @reactive
    let b = false; // @reactive
    
    <div $mount='#App'
        style:color={`${(a && !b) ? '#f44': '#4f4'}`}
    >
        Hello!
    </div> 

    a = true;
    b = true;
    // 预期绿色
}