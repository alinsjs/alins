/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-23 09:11:19
 * @Description: Coding something
 */

const list = [1,2,4,5,6];

list.push(3);

<div $$App>
    <For data={list}>
        <div id='d3'>{$item}</div>
    </For>
</div>;