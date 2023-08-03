/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:54:52
 * @Description: Coding something
 */

let count = 1;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;