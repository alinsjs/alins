/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-06 10:49:47
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-07 07:55:52
 */
import {$, subscribe, value, click, button, json} from '../alins';
const obj = $({a: 1, b: [1, 2]}); // 我们使用别名

obj[subscribe]((newValue, old) => {
    console.log(`subscribe: `, newValue, old);
});
obj.a[subscribe]((newValue, old) => {
    console.log(`av subscribe: `, newValue, old);
});
obj.b[subscribe]((newValue, old) => {
    console.log(`bv subscribe:`, newValue, old);
});

button('test react', click(() => {
    obj[value] = {a: 2, b: [2, 3]};
})).mount();

// reactObj[Alins.value] = {a:2,b:[2,3]}