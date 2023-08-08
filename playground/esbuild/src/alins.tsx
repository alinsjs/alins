/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 09:06:19
 * @Description: Coding something
 */
import {createContext as _$$} from '../../../packages/client-core/dist/alins.esm.min'
(window as any)._$$ = _$$;
let count = 1;

let React: any;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;