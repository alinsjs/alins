/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:03:02
 * @Description: Coding something
 */

export * from 'packages/core/src/index';
// 消除version重复
export * from '../../packages/style/src/index';
import {useAdoptedStyle} from '../../packages/style/src/index';
import * as Alins from 'packages/core/src/index';
// 调试时关闭adoptedStyle
useAdoptedStyle(false);
window.Alins = Alins;