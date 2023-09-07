
const data = use();

function use () {
    const $d = { list: [
        { name: '1', age: 10 },
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