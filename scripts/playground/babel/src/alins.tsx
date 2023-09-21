/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-05 23:36:10
 * @Description: Coding something
 */


let count = 1;

<button
    $mount={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;
/*

{
    // "plugins": [ "../../packages/plugin-babel/dist/babel-plugin-alins.cjs.min.js" ],
    "presets": [
        "@babel/preset-typescript",
        "@babel/preset-react"
    ]
}


*/