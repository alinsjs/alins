/*
 * @Author: chenzhongsheng
 * @Date: 2022-10-26 08:53:04
 * @Description: Coding something
 */

// todo

// /*
//  * @Author: tackchen
//  * @Date: 2022-10-25 17:08:44
//  * @Description: Coding something
//  */

// import {style} from './style';

// import {reactiveTemplate, parseReactionValue} from 'alins-reactive';
// import {TReactionItem, TReactionValue} from 'alins-utils';
// import {IMediaBuilder} from 'alins-utils';
// import {ICssBase, insertStyle} from './css';
// import {DataAlinsDom, getAlinsDomId} from './utils';

// type TMediaName = (typeof NoArgMedia)[number] | (typeof ArgMedia)[number];

// type IMediaClass = (...args: ICssBase[]) => IMediaBuilder;

// export interface IMediaConstructor {
//   (rule: string): IMediaClass;
// }

// const MediaId = 0;

// media(css(

// ));


// media(style());


// export const media: IMediaConstructor = (rule) => {
//     return (...args: ICssBase[]) => {
//         let template = '';
//         const reactions: TReactionItem[] = [];
        
//         args.forEach(style => {
//             if (typeof style === 'string') {
//                 template += style;
//             } else {
//                 const {scopeReactions, scopeTemplate} = style.generate(reactions.length);
//                 template += scopeTemplate;
//                 reactions.push(...scopeReactions);
//             }
//         });
//         let argTemplate = '';
//         if (typeof arg !== 'undefined') {
//             const argReaction = parseReactionValue(arg, reactions.length);

//             if (argReaction.reactions.length > 0) {
//                 reactions.push(...argReaction.reactions);
//             }
//             argTemplate = `(${argReaction.template})`;
//         } else {
//         }

//         const setStyle = insertStyle(document.head);
        
//         return {
//             type: 'pseudo',
//             exe (dom: HTMLElement) {
//                 const id = getAlinsDomId(dom);
//                 template = `[${DataAlinsDom}=${id}]:${name}${argTemplate}{${template}}`;
//                 if (reactions.length > 0) { // ???????????????????????????
//                     setStyle(reactiveTemplate(template, reactions, setStyle));
//                 } else {
//                     setStyle(template);
//                 }
//                 dom.setAttribute(DataAlinsDom, id);
//             }
//         };
//     };
// };

// // export const hover = pseudo('hover');

// // export const active = pseudo('active');

// // export const before = pseudo('before');

// // export const after = pseudo('after');

// // export const nthChild = (arg: TReactionValue<string|number>) => pseudo('nth-child', arg);