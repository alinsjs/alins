/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:53
 * @Description: Coding something
 */

import {alins} from 'packages/client-standalone';

const count = alins.react(1);

alins.Dom('button', {
    $parent: document.body,
    onclick () {count.v++;}
}, [count]);