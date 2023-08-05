/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-03 14:23:44
 * @Description: Coding something
 */
let i = 0;

<div $parent={document.body}>
    <button onclick={() => i++}>addCount({i})</button>
    <button onclick={() => i--}>minusCount({i})</button>
    <br/>
    <div>1111</div>
    <If data={i < 2}>
        <span>i &lt; 2</span>
        <If data={i < 1}>
            <span>i &lt; 1</span>
        </If>
    </If>
    {/* <Frag></Frag> */}
    <div>11</div>
    <div>222</div>
</div>;


