/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, div, comp, IComponent, click, $
} from '../alins';

export const Count2: IComponent = () => {
    // const count = $(0);
    return comp(Count2Comp);
};
function Count2Comp () {
    const count = $(0);
    const isStop = $(false);

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
        div($`Count is ${count}`),
        button(
            $`${() => isStop.value ? '暂停' : '继续'}`,
            click(toggle),
        ),
    ];
}