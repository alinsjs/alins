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