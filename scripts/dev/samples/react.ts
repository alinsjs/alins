/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-06 10:49:47
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-06 11:12:20
 */
import {$, subscribe, div, click, button} from '../alins';
const obj = $({a: 1, b: [1, 2]}); // 我们使用别名

obj[subscribe]((newValue, old) => {
    console.log(`subscribe: ${JSON.stringify(newValue)} ${JSON.stringify(old)}`);
});
obj.a[subscribe]((newValue, old) => {
    console.trace(`av subscribe: ${newValue} ${old}`);
});
obj.b[subscribe]((newValue, old) => {
    console.trace(`bv subscribe:`, newValue, old);
});

window.reactObj = obj;

// reactObj[Alins.value] = {a:2,b:[2,3]}