

import {buildData} from './data';
import {_$$} from 'packages/client-core';
const _$ = _$$();
/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-10 16:07:29
 * @Description: Coding something
 */

const selected = _$$.r({
    v: -1
});
const rows = _$$.r({
    v: []
});

function add () {
    rows.v.push(...buildData());
    // // buildData();
    // rows = [{id: 'xx', label: '2321'}];
    // rows.push({id: 'xx', label: '2321'});
}

function remove (id) {
    rows.v.splice(rows.v.findIndex(d => d.id === id), 1);
}
function select (id) {
    selected.v = id;
}
function run () {
    rows.v = buildData();
    selected.v = -1;
}
function update () {
    const n = rows.v.length;
    for (let i = 0; i < n; i += 10) {
        rows.v[i].label += ' !!!';
    }
}
function runLots () {
    rows.v = buildData(10000);
    selected.v = -1;
}
function clear () {
    rows.v = [];
    selected.v = -1;
}
function swapRows () {
    return _$.if(() => rows.v.length > 998, () => {
        const d1 = rows.v[1];
        rows.v[1] = rows.v[998];
        rows.v[998] = d1;
    }).end(() => {}); // if (rows.length > 5) {
    //     const d1 = rows[1];
    //     debugger;
    //     rows[1] = rows[3];
    //     debugger;
    //     rows[3] = d1;
    // }
}

// @ts-ignore
document.body.appendChild(_$$.ce('div', null, _$$.ce('div', {
    class: 'jumbotron'
}, _$$.ce('div', {
    class: 'row'
}, _$$.ce('div', {
    class: 'col-md-6'
}, _$$.ce('h1', null, 'Alins (non-keyed)')), _$$.ce('div', {
    class: 'col-md-6'
}, _$$.ce('div', {
    class: 'row'
}, _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'run',
    onclick: run
}, 'Create 1,000 rows')), _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'runlots',
    onclick: runLots
}, 'Create 10,000 rows')), _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'add',
    onclick: add
}, 'Append 1,000 rows')), _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'update',
    onclick: update
}, 'Update every 10th row')), _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'clear',
    onclick: clear
}, 'Clear')), _$$.ce('div', {
    class: 'col-sm-6 smallpad'
}, _$$.ce('button', {
    type: 'button',
    class: 'btn btn-primary btn-block',
    id: 'swaprows',
    onclick: swapRows
}, 'Swap Rows')))))), _$$.ce('table', {
    class: 'table table-hover table-striped test-data'
}, _$$.ce('tbody', null, rows.v.map(($item, $index) => _$$.ce('', null, _$$.ce('tr', {
    class: () => ({
        danger: $item.v.id === selected.v
    }),
    'data-label': () => $item.v.label
}, _$$.ce('td', {
    class: 'col-md-1'
}, () => $item.v.id), _$$.ce('td', {
    class: 'col-md-4'
}, _$$.ce('a', {
    onclick: () => select($item.v.id)
}, () => $item.v.label)), _$$.ce('td', {
    class: 'col-md-1'
}, _$$.ce('a', {
    onclick: () => remove($item.v.id)
}, _$$.ce('span', {
    class: 'glyphicon glyphicon-remove',
    'aria-hidden': 'true'
}))), _$$.ce('td', {
    class: 'col-md-6'
}))), true, '$item', '$index'))), _$$.ce('span', {
    class: 'preloadicon glyphicon glyphicon-remove',
    'aria-hidden': 'true'
})));