/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:20
 * @Description: Coding something
 */
// import {parseAlins} from 'packages/compiler-node';
import {parseAlins} from 'packages/compiler-node/dist/alins-compiler-node.esm.min';

console.log(parseAlins(`
import {createContext as _$$} from '../../../packages/client-core/dist/alins.esm.min'
window._$$ = _$$;
let count = 1;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;`));