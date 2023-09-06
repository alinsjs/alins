
const data = use();

function use () {
    const $d = { list: [
        { name: '1', age: 10 },
        { name: '2', age: 11 },
        { name: '3', age: 12 },
        { name: '4', age: 13 },
        { name: '5', age: 14 },
        { name: '6', age: 15 },
    ] };
    return $d;
}

const $bool = false;

// todo if 和 for 冲突问题

<div id='d1' $$App>
    <If data={data.list.length === 0}>
        <div id='d2'>Console is empty.</div>
    </If>
    <Else>
        <For data={data.list}>
            <div a={$bool} b={!$bool} id='d3'>{$item.name}-{$item.age}</div>
        </For>
    </Else>

    {/* <For data={data.list}>
        <div a={$bool} b={$bool} id='d3'>{$item}</div>
    </For> */}
</div>;