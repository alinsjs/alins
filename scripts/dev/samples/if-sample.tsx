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
    {/* {
        (() => {
            if (i < 3) {
                return <div>
                    <span>i &lt; 3</span>
                    {
                        (() => {
                            if (i < 2) {
                                return <span>i &lt; 2</span>;
                            } else {
                                return <span>i &gt;= 2</span>;
                            }
                        })()
                    }
                </div>;
            } else {
                return <div>i &gt;= 3</div>;
            }
        })()
    } */}
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
    <div>1111</div>
    <If data={i < 2}>
        <span>i &lt; 2</span>
        <If data={i < 1}>
            <span>i &lt; 1</span>
        </If>
    </If>
    <div>11</div>
    <div>222</div>
</div>;

// <!--222不见了--->


