/*
 * @Author: chenzhongsheng
 * @Date: 2023-10-18 10:15:35
 * @Description: Coding something
 */
// reactivescript

// 1. 普通值设置

let a = 1;
a = 3;
a += 1;

let a = ref(1);
a.set(1);
a.set(a.get()+1);

let a = 1;
let 

a = 1;

a?.set ? a.set(1): a=1;

a?.get() ?? 1;

a.set(1);



// 2. 对象

let data = {a:1};
data.a = 3;
data.a += 3;

let data = ref({a:1});
data.a.set(3);
data.a.set(data.a.get()+1);



ret a = r([]);

delete a[1];

a.del(1)


ret a = r({a:{b:1}});

delete a.a;
a.del('a');

a.a = 1;

a.set('a', 1);

let a = 