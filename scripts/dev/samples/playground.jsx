/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-06 23:37:14
 * @Description: Coding something
 */

// let a = 1; // @reactive
// let b = false; // @reactive

// <div $mount='#App'
//     style:color={`${(a > 3 && !b) ? '#f44': '#4f4'}`}
// >
//     Hello!
// </div>

// a ++;
// a ++;
// a ++;
// b = true;
// // a = true;
// // b = true;
// // 预期绿色

// const classList = ['a1'];
// let a2Flag = false;
// let i = 1;
// function toggleClass(e){
//     classList.push(`n${i++}`)
//     a2Flag = !a2Flag;
//     console.log(e.target.className)
// }
// <button $mount='#App'
//     class={`a ${classList.join(' ')}`}
//     class:a2={a2Flag}
//     class:a3={true}
//     onclick={toggleClass}
// >Toggle Class a2</button>;

const attrStr = 'a=va&b=vb&c=vc';
function logAttributes (e) {
    const attrs = e.target.attributes;
    for (const item of attrs) {
        console.log(`${item.name}=${item.value}`);
    }
}
const data = 'a'; // @reactive
<button $mount='#App'
    inner-attr="test"
    $attributes={attrStr}
    onclick={logAttributes}
>Click Me!</button>;

