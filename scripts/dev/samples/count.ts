/*
 * @Author: tackchen
 * @Date: 2022-10-20 23:41:34
 * @Description: Coding something
 */
import {life} from 'packages/core/src/builder/life';
import {
    button, div, comp, IComponent,
    IComponentOptions, click, $
} from '../alins';

export const Count: IComponent = ({prop}) => {
    // const count = $(0);
    return [
        div($`prop,${prop.value}`),
        comp(CountComp),
        comp(CountComp)
    ];
};
function CountComp () {
    const count = $(0);
    return [
        // life(),
        button(
            click(() => {count.value++;}),
            $`:Count is ${count}`
        ),
    ];
}


export function CountProps ({prop}: IComponentOptions) {

    life.mounted(() => {

    });
    return div(
        $`:Count is ${prop.count}`
    );
}