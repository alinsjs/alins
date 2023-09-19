/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:53
 * @Description: Coding something
 */

import { react, computed, Dom } from 'packages/client-standalone';

const count = react(1);
const countAdd1 = computed(() => count.v + 1);
Dom('button', {
    $mount: document.body,
    onclick: () => count.v++,
}, [
    react`count is ${count}; countAdd1 is ${countAdd1}`
]);