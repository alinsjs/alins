<!--
 * @Author: chenzhongsheng
 * @Date: 2023-08-08 11:09:50
 * @Description: Coding something
-->
```
pnpm i
npm run boot
npm run build

cd playground/vite
pnpm i
npm run dev
```

一些规则

1. 变量定义规则

```ts
const _a = 1; // 强制定义静态变量
const $a = 1; // 强制定义动态变量
const $$a = 1; // shallow类型的动态变量

const a = 1; // @reactive // 强制定义静态变量
const a = 1; // @static // 强制定义动态变量
const a = 1; // @shallow  // shallow 类型的动态变量
```

2. jsx 语法糖


```ts
<div $src></div> => <div src={src}></div>
<div src:a></div> => <div src={a}></div>
<div class:a={bool}></div> => <div class={bool?'a':''}></div>
<div style:color={color}></div> => <div style={`color:${coloe}`}></div>
<div onclick={a++}></div> => <div onclick={()=>a++}></div>
<div onclick:pure={a()}></div> => <div onclick={a()}></div>
<div $mount='body'></div> => <div $mount={document.body}></div>
<div $$App></div> => <div $mount='#App'></div>

```