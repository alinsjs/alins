/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, div, comp, IComponent,
    IComponentOptions, click, $,
} from '../alins';

export const Count: IComponent = () => {
    const count = $(0);
    return [
        div($`Count is ${count}`),
        button(
            click(() => {count.value++;}),
            $`:Count is ${count}`
        ),
    ];
};

export function CountProps ({props}: IComponentOptions) {
    return div(
        $`:Count is ${props.value}`
    );
}