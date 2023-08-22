/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-22 11:03:06
 * @Description: Coding something
 */
const msg = 'World';
let a = { a () {alert(111);} };
a.a = ()=>{};

<div onclick={a.a} $$App>Hello {msg}!</div>;
// $$App is short for $parennt='#App'
// Or use `document.getElementById('App').appendChild(<div/>)`