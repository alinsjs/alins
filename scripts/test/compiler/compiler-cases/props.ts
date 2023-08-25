/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-01 01:15:31
 * @Description: Coding something
 */
import {ICodeMap} from '../util';
// import { parseAlins } from 'src/node-parser';
 
// input: 'import aa from "aa"; var a=1;export let b=a+1; a=2;var s = `${a}${a+1}`;var d=<div class={a+1} b={`2${a}1${a+1}`}>{a}{a+1}</div>',

export default [
    {
        name: 'props',
        disabled: false,
        input: `
`,
        output: `
        `
    },
    
] as ICodeMap[];
