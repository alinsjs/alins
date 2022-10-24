/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, div, comp, IComponent, click, react
} from '../alins';

export const Count2: IComponent = () => {
    // const count = react(0);
    return comp(Count2Comp);
};
function Count2Comp () {
    const count = react(0);
    const isStop = react(false);

    let timer: any = null;

    const toggle = () => {
        if (isStop.value) {
            clearInterval(timer);
        } else {
            timer = setInterval(() => {count.value++;}, 1000);
        }
        isStop.value = !isStop.value;
    };

    toggle();

    return [
        div(react`Count is ${count}`),
        button(
            react`${() => isStop.value ? '暂停' : '继续'}`,
            click(toggle),
        ),
    ];
}