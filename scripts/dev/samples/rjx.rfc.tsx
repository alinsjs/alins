/* eslint-disable semi */
/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-13 16:53:49
 * @Description: Coding something
 */
function useCount () {
    return {
        count: 0,
        increase () {
            this.count ++;
        }
    };
}

function Counter () {
    // @state-scope
    const { count, increase } = useCount();
    return <button onclick={increase}>count is {count} {1 + count}</button>;
}

let a = 1;

let a = 1, b = $ref(2), c = 3

$static
let a = 1;

$shallow
let a = $shallow`{ a: 1 }`

$mount;
<div></div>; '#App';

$mount`${<div></div>}, '#App'`;

let a = b + 1;
$set(a, () => {

});

$mounted(() => {

});


