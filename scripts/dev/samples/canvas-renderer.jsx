/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-09 23:34:59
 * @Description: Coding something
 */

let msg = 'Hello World';

const canvas = initCanvas();

const ctx = initCanvasCtx(canvas);

const root = window.Alins.useRenderer({
    render (element) {
        const parent = element.parentElement || { deep: 0 }; // @static
        if (!parent.textLeft) parent.textLeft = 10;
        ctx.fillText(element.textContent, parent.textLeft, parent.deep  * 15 + 10);
        parent.textLeft += (ctx.measureText(element.textContent).width + 10);
        // ctx.fillText(element.textContent, 10, 10);
        return (el) => {el.textLeft = 0;};
    },
});

startCanvasRender(canvas, root);

function initCanvas () {
    let canvas;
    <div $$App>
        <canvas $ref={canvas} style='border: 1px solid #222'></canvas>
        <div>msg = {msg}</div>
        <button onclick={msg += '!'}>Click Me </button>
    </div>;
    return canvas;
}
function initCanvasCtx (canvas, size = 300) {
    const scale = window.devicePixelRatio;
    canvas.width = canvas.height = size * scale;
    canvas.style.width = canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    ctx.font = `${15 * scale}px Microsoft Sans Serif`;
    ctx.fillStyle = '#222';
    ctx.textBaseline = 'top';
    return ctx;
}

function startCanvasRender (canvas, root) {
    <div $mount={root}>
        msg = {msg}
    </div>;
    function loopRender () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        root.render();
        // setTimeout(loopRender, 1000);
        requestAnimationFrame(loopRender);
    }
    loopRender();
}
