/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:20
 * @Description: Coding something
 */
import {parseAlins} from 'packages/compiler-node';

console.log(parseAlins(`let count = 1;
<button 
    $parent={document.body}
    onclick={()=>{count++}}
>{count}</button>;`));