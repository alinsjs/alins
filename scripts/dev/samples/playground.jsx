/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-15 21:38:18
 * @Description: Coding something
 */
// function test () {

// let a = 0;
// window.ss = () => a = 1;
// if (a === 0) {
//     console.log(111);
// } else if (a === 1) {
//     return <div>22</div>;
// }

// return <div>33</div>;

const a = 0;

const fn = () => a + 1;

function fn2 () {
    return a + 1;
}

fn();

const c = fn();
const c2 = fn2();

const c3 = c + 1;

const dom = <div a={fn()}></div>;
// a ++;


// const dom = test();

// console.log(dom);

// document.body.appendChild(dom);