
let data = use();

function use(){
    let $d = {list:[]};
    return $d;
}

<div id='d1' $$App>
    <If data={data.list.length === 0}>
        <div id='d2'>Console is empty.</div>
    </If>
    <Else>
        <For data={data.list}>
            <div id='d3'>{$item}</div>
        </For>
    </Else>
</div>
