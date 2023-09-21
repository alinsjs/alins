/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 09:06:19
 * @Description: Coding something
 */

let count = 1;

<button
    $mount={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;