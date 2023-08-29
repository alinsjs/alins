/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:54:52
 * @Description: Coding something
 */
// import {_$$} from 'alins';
// var _$$$ = window.Alins._$$;


let count = 1;

<button
    $mount={document.body}
    onclick={() => {count++;}}
    style={{width: 10}}
>click:{count}</button>;


// const a = {a: 1};

// let dom;

// <div $ref={dom} style={{
//     overflow: 'auto',
//     width: 0,
// }} {...a}></div>;
