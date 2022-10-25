/*
 * @Author: tackchen
 * @Date: 2022-10-24 19:48:05
 * @Description: Coding something
 */
import {$, style} from '../alins';

export function onlyUseStyle () {
    const num = $(20);
    const color = $('#222');

    const div = document.createElement('div');
    div.innerText = 'onlyUseStyle, click to change';
    div.addEventListener('click', () => {
        num.value = 30;
        color.value = '#f44';
    });

    style({color, fontSize: num}).mount(div);

    return div;
}