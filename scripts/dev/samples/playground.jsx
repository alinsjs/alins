/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-06 23:37:14
 * @Description: Coding something
 */

// function useCount () {
//     let count = 0;

//     return $state({
//         count,
//         increase () {
//             count ++;
//         }
//     });
// }

// const { count, increase } = useCount();

// const state = useCount();


// const v2 = { a: 0 };

// v2.a ++;

let v = 1;

_: a = Alins.ref({
    a1: Alins.computed(() => v),
    a2: 1
});

v ++;
a.a++;

<div $:App>{() => `a: ${a.v.a1.v}; v: ${a.v.a2}`}</div>;

// const data = { a: 1 };
// data.a++;

// <div $:App>{`value: ${data.a}`}</div>;

