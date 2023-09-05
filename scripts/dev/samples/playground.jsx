
const data = use();

function use () {
    const $d = { list: [] };
    return $d;
}

const $n = 0;

// todo if 和 for 冲突问题

<div id='d1' $$App>
    <Switch data={data.list.length}>
        <Case data={0}>
            <div id='d2'>Console is empty.</div>
        </Case>
        <Case data={1}>
            <For data={data.list}>
                <div id='d3'>1:{$item}</div>
            </For>
        </Case>
    </Switch>
</div>;