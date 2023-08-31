/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-23 09:11:19
 * @Description: Coding something
 */

const data = {list: [1,2,4,5,6]};

data.list.push(3);

<div $$App>
    <Switch data={data.list.length}>
        <Case data={0}>empty.</Case>
        <Case data={1}>
            <For data={data.list}>
                <div id='d3'>=1:{$item}</div>
            </For>
        </Case>
        <Default>
            <For data={data.list}>
                <div id='d3'>=2:{$item}</div>
            </For>
        </Default>
        {/* <Case data={1}>
            <For data={data.list}>
                <div id='d3'>=1:{$item}</div>
            </For>
        </Case> */}
        {/* <Case data={2}>
            <For data={data.list}>
                <div id='d3'>=2:{$item}</div>
            </For>
        </Case> */}
    </Switch>
</div>;

// const data = {list: [1,2,4,5,6]};

// data.list.push(3);

// <div $$App>
//     <If data={data.list.length === 0}>
//         <div id='d2'>Console is empty.</div>
//     </If>
//     <Else>
//         <For data={data.list}>
//             <div id='d3'>{$item}</div>
//         </For>
//     </Else>
// </div>;