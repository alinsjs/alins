/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {
    button, div, comp, IComponent,
    IComponentOptions, click, $
} from '../alins';

export const Count: IComponent = () => {
    // const count = $(0);
    return comp(CountComp);
};
function CountComp () {
    const count = $(0);
    return [
        button(
            click(() => {count.value++;}),
            $`:Count is ${count}`
        ),
    ];
}


export function CountProps ({prop}: IComponentOptions) {
    return div(
        $`:Count is ${prop.count}`
    );
}