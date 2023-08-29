/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-02 23:31:20
 * @Description: Coding something
 */
// import {parseAlins} from 'packages/compiler-node';
import {parseAlins} from 'packages/compiler-node/dist/alins-compiler-node.esm.min';

// console.log(parseAlins(`
// let count = 1;

// <button
//     $mount={document.body}
//     onclick={() => {count++;}}
// >click:{count}</button>;`));

console.log(parseAlins(`
const data = useState();
data.a = 1;
<div a={data.a()} b={data.b}>{data.c}</div>;`));