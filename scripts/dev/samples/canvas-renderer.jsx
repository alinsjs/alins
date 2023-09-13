/*
 * @Author: chenzhongsheng
 * @Date: 2023-09-10 21:16:42
 * @Description: Coding something
 */
import { useRenderer } from 'alins';

let msg = 'Hello World';

const canvas = initCanvas();

const ctx = initCanvasCtx(canvas);

const root = useRenderer({
    render (element) {
        const _parent = element.parentElement || { deep: 0 };
        if (!_parent.textLeft) _parent.textLeft = 10;
        ctx.fillText(element.textContent, _parent.textLeft, (_parent.deep - 1)  * 15 + 10);
        _parent.textLeft += (ctx.measureText(element.textContent).width);
        return el => {el.textLeft = 0;};
    },
});

startCanvasRender(canvas, root);

function initCanvas () {
    let canvas;
    <div $$App>
        <canvas $ref={canvas} style='border: 1px solid #666;'></canvas>
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
    ctx.fillStyle = '#eee';
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
        requestAnimationFrame(loopRender);
    }
    loopRender();
}
