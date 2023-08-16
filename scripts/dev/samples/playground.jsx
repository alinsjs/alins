/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-16 23:03:29
 * @Description: Coding something
 */

// let a = 0;
// window.ss = () => a = 1;
// if (a === 0) {
//     console.log(111);
// } else if (a === 1) {
//     return <div>22</div>;
// }

// return <div>33</div>;


// @shallow

// let a = 1;

// a++;

// const fn = () => {};

// <div a={fn()}></div>;

// const examples = [ {
//     name: 'test',
//     code: 'console.log("Hello")'
// } ];

// function switchExample (code) {
//     console.log(code);
// }

// export function ExamplesList () {
//     return <For data={examples}>
//         <div onclick={() => switchExample($item.code)}>{$item.name}</div>
//     </For>;
// }

// document.body.appendChild(dom);

const data = useState();

<div a={data.a()} b={data.b}>{data.c}</div>;