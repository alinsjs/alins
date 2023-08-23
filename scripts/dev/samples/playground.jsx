/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-22 21:56:08
 * @Description: Coding something
 */
function Componnt(){
    const data = [{name: 'Bob', age: 10}, {name: 'Alice', age: 11}]
    let age = 10;
    return <>
        <button onclick={
            list.unshift({name: 'Tom', age: age++})
        }>Add Person</button>
        <For data:list>
            <div>{$index+1}: name={$item.name}; age={$item.age};</div>
        </For>
    </>
    // You can specify the name of the $item and $index through the name attribute: item='person' index='i'
}

<Componnt $$body/>;