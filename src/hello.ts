import {div} from './core/builder/builder';
import {IComponent} from './core/comp/comp';

/*
 * @Author: tackchen
 * @Date: 2022-10-17 22:00:45
 * @Description: Coding something
 */
export const hello: IComponent = () => {
    return div(':hello');
};