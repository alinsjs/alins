'use strict';
import {
    div, click, table, span, h1, button,
    $, dom, td, tr, a, comp, value, json
} from '../../../alins';
import {buildData} from './data';
// const {div, click, table, span, cls, h1, button, $, dom, td, tr, a, comp} = window.Alins;

import * as Alins from '../../../alins';

(window).Alins = Alins;

// const value = window.__alins_value;

const selected = $(-1);
const rows = $([]);
const array = $([1, 2]);
const o = $({a: 1});

div($`a:${o.a},b:${o.b}`).mount();
div(
    div.for(array)(item => [
        $`--${item}`
    ])
).mount();

function setRows (update = []) {
    rows[value] = update;
}

function add () {
    rows.push.apply(rows, buildData(1000));
}
  
function remove (id) {
    rows.splice(
        rows.findIndex((d) => d.id.value === id.value),
        1
    );
}
  
function select (id) {
    selected.value = id.value;
}

function run () {
    setRows(buildData());
    selected.value = -1;
}
  
function update () {
    const len = rows.length;
    for (let i = 0; i < len; i += 10) {
        rows[i].label.value += ' !!!';
    }
}
  
function runLots () {
    setRows(buildData(2000));
    selected.value = -1;
}
  
function clear () {
    setRows([]);
    selected.value = -1;
}
  
function swapRows () {
    if (rows.length > 4) {
        const d1 = rows[1][value];
        const d4 = rows[4][value];
        rows[1][value] = d4;
        rows[4][value] = d1;
    }
}

div('.container',
    comp(Jumbotron),
    comp(Table),
    span('.preloadicon.glyphicon.glyphicon-remove[aria-hidden=true]')
).mount('#main');

function Jumbotron () {
    return div('.jumbtron',
        div('.row',
            div('.col-md-6', h1('Alins-"keyed"')),
            div('.col-md-6',
                div('.row',
                    div('.col-sm-6.smallpad',
                        button(click(run), '#run[type=button].btn.btn-primary.btn-block:Create 1,000 rows'),
                    ),
                    div('.col-sm-6.smallpad',
                        button(click(runLots), '#runlots[type=button].btn.btn-primary.btn-block:Create 10,000 rows'),
                    ),
                    div('.col-sm-6.smallpad',
                        button(click(add), '#add[type=button].btn.btn-primary.btn-block:Append 1,000 rows'),
                    ),
                    div('.col-sm-6.smallpad',
                        button(click(update), '#update[type=button].btn.btn-primary.btn-block:Update every 10th row'),
                    ),
                    div('.col-sm-6.smallpad',
                        button(click(clear), '#clear[type=button].btn.btn-primary.btn-block:Clear'),
                    ),
                    div('.col-sm-6.smallpad',
                        button(click(swapRows), '#swaprows[type=button].btn.btn-primary.btn-block:Swap Rows')
                    ),
                )
            ),
        )
    );
}

function Table () {
    const tbody = dom('tbody');

    return table('.table.table-hover.table-striped.test-data',
        tbody('#tbody',
            tr.for(rows)(({id, label}) => [
                $`[data-label=${label}].${() => id.value === selected.value ? 'danger' : 'a'}`,
                td($`.col-md-1:${id}`),
                td('.col-md-4', a($`${label}`, click(select).args(id))),
                td('.col-md-1', a(click(remove).args(id),
                    span('.glyphicon.glyphicon-remove[aria-hidden=true]:remove')
                )),
                td('.col-md-6'),
            ])
        )
    );
}
