/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 19:37:29
 * @Description: Coding something
 */

function HelloWorld (): any {
    let msg = 'Hello World';
    const show = false;
    if (show) {
        return <div
            class="{show ? 'aa' : msg}"
            aa='11'
            onclick={() => {msg = 'xx';}}
        >
            <span onclick={() => {msg = 'xx';}}></span>
        </div>;
    }
    return null;
}