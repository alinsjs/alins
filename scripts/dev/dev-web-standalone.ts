/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:53
 * @Description: Coding something
 */

import { ref, computed, watch, Dom, join, Component } from 'packages/client-standalone';
// const { react, computed, Dom } = window.Alins;

// const count = ref(1);
// const countAdd1 = computed(() => count.v + 1);
// Dom.button({
//     $mount: document.body,
//     onclick: () => count.v++,
// }, join`count is ${count}; countAdd1 is ${countAdd1}`);


// function Counter () {
//     const count = ref(1);
//     const countAdd1 = computed(() => count.v + 1);
//     return Dom.button({
//         $mount: document.body,
//         onclick: () => count.v++,
//     }, join`count is ${count}; countAdd1 is ${countAdd1}`);
// }

// Component(Counter);

const count = ref(1);
const countAdd1 = computed(() => count.v + 1);

const button = document.createElement('button');
button.onclick = () => { count.v ++; };
document.getElementById('App').append(button);

const update = () => {
    button.innerText = `count = ${count.v}, count+1=${countAdd1.v}`;
};
update();
watch(count, update);