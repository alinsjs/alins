let count = 1;

const object1 = {
    countAdd2: count + 1
};

const object2 = {
    countAdd3: object1.countAdd2 + 1
};

<div $$App>
    <button onclick={count++}>
        click:{count}
    </button>
    <div>object1.countAdd2 = {object1.countAdd2}</div>
    <div>object2.countAdd3 = {object2.countAdd3}</div>
    <Comp oo={object2}></Comp>
</div>;

function Comp ({ oo }) {
    return <div>oo={oo.countAdd3}</div>;
}