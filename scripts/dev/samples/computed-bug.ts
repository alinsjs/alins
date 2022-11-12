/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-12 09:21:14
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 13:38:12
 */


import {
    mount, div, react, comp, button,
    click, prop, css, style,
    $, input, mounted, updated, created, removed, appended,
    html, text, value, json
} from '../alins';


// css('.danger')(style.backgroundColor('#eee')).mount();

const list = $([1, 2, 3]);

div.for(list)((item, index) =>
    // div(() => $`${index}: ${item}`)
    div(() => $`${index}: ${() => 'item=' + item.value}.${() => item.value === 1 ? 'danger' : 'xx'}`)
).mount();

button('switch item', click(() => {
    const a = list[0].value;
    list[0] = list[2].value;
    list[2] = a;
})).mount(); ;

const list2 = $([{
    name: 'bob', age: 10
}, {
    name: 'tack', age: 11
}, {
    name: 'allen', age: 13
}]);

div.for(list2)(({name, age}, index) => {
    // return div(() => $`${index}: ${name}(${age})`);
    return div(() => $`${index}: ${() => {
        return name.value + age.value;
    }}`);
}
).mount();

// div.for(list2)((item, index) => {
//     return div(() => $`${index}: ${() => item.name.value + item.age.value}`);
// }
// ).mount();

button('switch item2', click(() => {
    const a = list2[0][value];
    list2[0][value] = list2[2][value];
    list2[2][value] = a;
})).mount(); ;

const num = $(0);
const o = $({a: 1});

div(
    $`num=${() => num.value + '!'}; oa=${() => o.a.value + '!!'}`,
    button('num++', click(() => {
        num.value++;
        o.a.value++;
    }))
).mount();


// interface ITestItem<T>{
//   value: T;
// }
// type ITestWrap<T> = T extends object ? (ITestJson<T>) : ITestItem<T>;

// interface ITestArray<T> extends Array<T> {
//   value: T;
// }

// const s = '';

// type ITestJson<T> = {
//   [prop in (keyof T)]: ITestWrap<T[prop]>;
// } & ITestObject<T>; // ! & IJson 为了绑定的时候不报类型错误

// interface ITestObject<T> {
//   // ! 本来应该使用 T，
//   // ! 由于封装了一层，所以赋值时ts类型系统会报错，故使用IJson
//   // ! 牺牲了 value和json返回值的类型
//   [value]: T;
// }
// const tl2: ITestWrap<({name: string, age:number})[]> = [] as any as ITestWrap<({name: string, age:number})[]>;

// const tl20 = tl2[0][value];


// tl2[0] = {name: '', age: 1};

// const v: ITestItem<number> = 3 as ITestItem<number>;

// const vv = v.value;

// const aaa: ITestWrap<number[]> = [] as any as ITestWrap<number[]>;

// const d = aaa.value;

// const bbb: ITestWrap<{a: {b:number}}> = {} as any as ITestWrap<number[]>;

// const bb = bbb.a.value;

// const a2: ITestItem[] = [];
// const d2 = a2[0];