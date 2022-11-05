/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, IComponent, comp, prop, on,
    IComponentOptions, click, $, input, span,
} from '../alins';

export const Count: IComponent = () => {
    const count = $(0);
    return [
        span('输入count'),
        input.model(count, 'number'),
        comp(CountProps, prop({value: count})),
        button('add', on('click')(() => {count.value++;})),
        button('add', click(() => {count.value++;})),
    ];
};

export function CountProps ({props}: IComponentOptions) {
    return span(
        $`Count is ${props.value}`
    );
}