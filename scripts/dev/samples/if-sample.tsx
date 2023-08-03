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
    {
        (() => {
            if (i < 3) {
                return <>
                    <span>i &lt; 3</span>
                    {
                        (() => {
                            if (i < 2) {
                                return <span>i &lt; 2</span>;
                            }
                        })()
                    }
                </>;
            }
        })()
    }
</div>;


{/* <If data={i === 0}>
<span>i = 0</span>
</If>
<ElseIf data={i < 3}>
<span>i &lt; 3</span>
<If data={i < 2}>
    <span>i  &lt; 2</span>
</If>
</ElseIf>
<Else>
<span>i &gt;= 3</span>
</Else> */}
