/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-25 11:08:54
 * @Description: Coding something
 */
function Comp ({ id, count, add }) {
    return <div id="it">Div{id} Now count {count}
        <button onclick={add}> Inc </button>
    </div>;
}
function Main () {
    let count: number = 0;
    const add = () => {count++; console.log(count);};
    if (count % 3 == 0) {
        return <Comp id='1' count={count} add={add}/>;
    } else if (count % 3 == 1) {
        return <Comp id='2' count={count} add={add}/>;
    } else {
        return <Comp id='3' count={count} add={add}/>;
    }
}
<Main $$App/>;


function Main () {
    let count: number = 0;
    const add = () => {count++;};
    const b = <button onclick={add}> Inc </button>;

    let d1;

    if (count % 3 == 0) {
        d1 = <div id="it">Div1 Now count {count}</div>;
    } else if (count % 3 == 1) {
        d1 =  <div id="it">Div2 Now count {count}</div>;
    }
    else d1 = <div id="it">Div3 Now count {count}</div>;

    d1.appendChild(b);
    return d1;
}
<Main $$App/>;