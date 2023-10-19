/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-16 10:17:15
 * @Description: Coding something
 */

const data = { a: 1, b: 2, c: 3 };
const data2 = [ 1, 2, 3 ];
const { a: A, b, ...dd } = data;
const [ a1, a2, ...args ] = data2;

data.a ++;

data2[0] ++;

function useCounter () {
    let count = 0;
    return {
        countAdd1: count + 1,
        count,
        add () {
            count ++;
        }
    };
}

function useCounter2 () {
    let count = 0;
    return $state({
        count,
        add () {
            count ++;
        }
    });
}


const { count, add } = useCounter();

const counter = useCounter();

counter.count;

counter.count = 1;


// let v = 0;
// v++;

// const vv = {
//     v,
// };


// const vv = {
//     v: ,
// };

// <div data={{
//     v,
// }}></div>;

/*


*/