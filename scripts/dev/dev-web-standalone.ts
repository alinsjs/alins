/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:53
 * @Description: Coding something
 */

import { ref, computed, Dom, join } from 'packages/client-standalone';
// const { react, computed, Dom } = window.Alins;

const count = ref(1);
const countAdd1 = computed(() => count.v + 1);
Dom.button({
    $mount: document.body,
    onclick: () => count.v++,
}, join`count is ${count}; countAdd1 is ${countAdd1}`);