/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-05 23:36:10
 * @Description: Coding something
 */

import {createContext as _$$} from '../../../packages/client-core/dist/alins.esm.min'
window._$$ = _$$;
let count = 1;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;