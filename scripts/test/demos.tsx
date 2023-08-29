/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-28 22:19:57
 * @Description: Coding something
 */
export function forFunc(){
    const data = use();

    function use () {
        const $d = {list: []};
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