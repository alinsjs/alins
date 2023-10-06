let count = 1;
const countAdd2 = count + 2;
const countAdd3 = countAdd2 + 1;
function countMultiply2 () {
    return count * 2;
}
<div $mount='#App'>
    <button onclick={count++}>
         click:{count}
    </button>
    <div>count + 2 = {countAdd2}</div>
    <div>count + 3 = {countAdd3}</div>
    <div>count + 4 = {countAdd3 + 1}</div>
    <div>count * 2 = {countMultiply2}</div>
    <div>count * 2 = {countMultiply2()}</div>
    <div>count * 4 = {countMultiply2() * 2}</div>
</div>;