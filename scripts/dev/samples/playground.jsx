function Main () {
    let count = 0;
    const add = () => {count++;};
    return <div $switch={count}>
        <button $case={1} $break={false} onclick={add}>Count is 1</button>
        <button $case={2} onclick={add}>Count is 1 or 2:{count}</button>
        <button $default onclick={add}>Other Count:{count}</button>
    </div>;
}
<Main $$App/>;