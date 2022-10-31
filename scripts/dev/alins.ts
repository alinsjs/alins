/*
 * @Author: tackchen
 * @Date: 2022-10-23 20:03:02
 * @Description: Coding something
 */

export * from 'packages/core/src/index';
export * from 'packages/style/src/index';

// export * from 'packages/core/dist/alins.esm';
// export * from 'packages/style/dist/alins-style.esm';

import * as Alins from 'packages/core/src/index';
import * as AlinsStyle from 'packages/style/src/index';

window.xxxx = Alins;
window.yyyy = AlinsStyle;