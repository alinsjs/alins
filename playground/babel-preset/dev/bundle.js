import { _$$ } from "alins";
/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-05 23:36:10
 * @Description: Coding something
 */

let count = _$$.r({
  v: 1
});
_$$.ce("button", {
  $parent: document.body,
  onclick: () => {
    count.v++;
  }
}, "click:", count);
/*

{
    // "plugins": [ "../../packages/plugin-babel/dist/babel-plugin-alins.cjs.min.js" ],
    "presets": [
        "@babel/preset-typescript",
        "@babel/preset-react"
    ]
}


*/
export {};
