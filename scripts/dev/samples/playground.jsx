

/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-03 00:18:07
 * @Description: Coding something
 */

// #todolist
function List () {
    const list = [ 'todo1' ];
    const value = '';
    return <div>
        <div>
            <input type="text" value={value}/>
            <button onclick={() => { list.push(value); }}>add</button>
        </div>
        <For data={list}>
            <Item item={$item} index={$index}>
                <button onclick={() => {list.splice($index, 1);}}>delete</button>
            </Item>
        </For>
    </div>;
}

function Item ({ item, index }, children) {
    let done = false;
    return <div style={{
        textDecoration: done ? 'line-through' : 'none',
        color: done ? '#888' : 'inherit',
    }}>
        <span>{index + 1}: {item}</span>
        <button onclick={() => { done = !done; }}>done</button>
        {children}
    </div>;
}

<List $mount={document.body}/>;