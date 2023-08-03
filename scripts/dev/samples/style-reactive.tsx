/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-03 11:22:38
 * @Description: Coding something
 */

// let count = 1;

// <div
//     $parent={document.body}
//     onclick={() => {count++;}}
// >click:{count}</div>;

const style = {
    position: 'relative',
    left: '0px',
    top: '0px',
    color: '#f44',
    fontSize: '14px',
};
<div $parent={document.body}>
    <div>
        <span>颜色:</span>
        <input type="text" value={style.color}/>
    </div>
    <div>
        <span>字体大小:</span>
        <input type="text" value={style.fontSize}/>
    </div>
    <div>
        <span>left:</span>
        <input type="text" value={style.left}/>
    </div>
    <div>
        <span>top:</span>
        <input type="text" value={style.top}/>
    </div>
    <div style={style}>显示文本</div>
</div>;
