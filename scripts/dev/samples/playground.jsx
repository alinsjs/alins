
// function Main () {
//     let count = 0;
//     const add = () => {count++;};
//     return <Switch data={count}>
//         <Case data={1} break={false}>
//             <button onclick={add}>Count is 1</button>
//         </Case>
//         <Case data={2}>
//             <button onclick={add}>Count is 1 or 2:{count}</button>
//         </Case>
//         <Default>
//             <button onclick={add}>Other Count:{count}</button>
//         </Default>
//     </Switch>;
// }
// <Main $$App/>;


function a () {
    static: count = 0;
    const add = () => {count++;};
    // @static-scope
    $static: switch (count) {
        case 2: return <button onclick:add>Count is 1 or 2:{count}</button>;
    }
}