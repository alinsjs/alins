/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, div, comp, IComponent,
    IComponentOptions, click, react
} from '../alins';

export const Count: IComponent = () => {
    // const count = react(0);
    return comp(CountComp);
};
function CountComp () {
    const count = react(0);
    return [
        button(
            click(() => {count.value++;}),
            react`:Count is ${count}`
        ),
    ];
}


export function CountProps ({prop}: IComponentOptions) {
    return div(
        react`:Count is ${prop.count}`
    );
}