/*
 * @Author: tackchen
 * @Date: 2022-10-15 19:53:12
 * @Description: Coding something
 */
// /*
//  * @Author: tackchen
//  * @Date: 2022-10-11 08:31:28
//  * @Description: Coding something
//  */

// import {TBuilderArg} from '../builder/builder';
// import {IElementBuilder} from '../element/transform';
// import {IReactWrap} from '../reactive/react';

// export interface IIfController {
//     <T>(
//         list: IReactWrap<T>[],
//         callback: (item: IReactWrap<T>, index: number) => IElementBuilder
//     ): IElementBuilder[];
// }

// export interface IForCallback<T=any> {
//     (item: IReactWrap<T>, index?: number): TBuilderArg[];
// }

// export const ifController: IForController = function (list, callback) {
//     // todo reactive index
//     return list.map((item, index) => {
//         return callback(item, index);
//     });
// };