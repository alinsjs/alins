
function Main () {
    let count = 0;
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