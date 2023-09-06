/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-28 22:19:57
 * @Description: Coding something
 */
export function forFunc () {
    const data = use();

    function use () {
        const $d = { list: [] };
        return $d;
    }

    let bool = false;

    bool = true;

    // todo if 和 for 冲突问题

    return <div id='d1' $$App>
        <If data={data.list.length === 0}>
            {/* <If data={bool}> */}
            <div id='d2'>Console is empty.</div>
        </If>
        <Else>
            <For data={data.list}>
                <div id='d3'>{$item}</div>
            </For>
        </Else>
    </div>;
}

function SyncHeight () {
    let height = 0;

    function syncHeight (el) {
        const ro = new ResizeObserver(() => height = el.offsetHeight);
        ro.observe(el);
        return () => ro.disconnect();
    }

    <div $mount='#App'>
        <textarea $mounted={syncHeight} />
        <div>height is {height}</div>
    </div>;
}

function switchCase () {

    const data = use();

    function use () {
        const $d = { list: [ 1 ] };
        return $d;
    }

    const $n = 0;

    // todo if 和 for 冲突问题

    <div id='d1' $$App>
        <Switch data={data.list.length}>
            <Case data={1} break={false}>
                <div id='d2'>Console is empty.</div>
            </Case>
            <Case data={2}>
                <For data={data.list}>
                    <div id='d3'>1:{$item}</div>
                </For>
            </Case>
            <Case data={3} break={false}>
    3333
            </Case>
            <Case data={4}>
    44444
            </Case>
        </Switch>
    </div>;

}

export function multiIf () {
    let a = 0;

    a ++;

    <div $$App>
    11
        <If data={a < 4}>
        a &lt; 4;
            <If data={a < 3}>
            1: a &lt; 3;
                <If data={a < 2}>
                11: a = 1;
                </If>
                <Else>
                11: a = 2
                </Else>
            </If>
            <Else>
            1: a = 3
            </Else>
        22
        </If>
        <Else>
            <If data={a < 5}>
            2:a = 4
            </If>
            <Else>
            2:a &gt; 6
            </Else>
        </Else>
    </div>;
}