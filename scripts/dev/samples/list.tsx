/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-10 16:07:29
 * @Description: Coding something
 */


let selected = -1;
let rows = [
    // {id: '1', label: 'xxx'},
    // {id: '2', label: 'xxx'},
    // {id: '3', label: 'xxx'},
    // {id: '4', label: 'xxx'},
    // {id: '5', label: 'xxx'},
    // {id: '6', label: 'xxx'},
    // {id: '7', label: 'xxx'}
];

window._rows = () => rows;

function add () {
    // buildData();
    rows = [{id: 'xx', label: '2321'}];
    // rows.push({id: 'xx', label: '2321'});
}

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
    selected = -1;
}

function clear () {
    rows = [];
    selected = -1;
}

function swapRows () {
    // if (rows.length > 998) {
    //     const d1 = rows[1];
    //     const d998 = rows[998];
    //     rows[1] = d998;
    //     rows[998] = d1;
    // }
    if (rows.length > 5) {
        const d1 = rows[1];
        const d3 = rows[3];
        rows[1] = d3;
        rows[3] = d1;
    }
}

// @ts-ignore
document.body.appendChild(<div>
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Vue.js 3 (non-keyed)</h1>
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
                    class={{danger: $item.id === selected}}
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
