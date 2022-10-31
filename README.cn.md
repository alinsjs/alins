<!--
 * @Author: tackchen
 * @Date: 2022-10-23 21:15:35
 * @Description: Coding something
-->

<p align="center">
    <img src='https://shiyix.cn/alins.png' width='100px'/>
</p> 

<p align="center">
    <a href="https://www.github.com/alinsjs/alins/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/alinsjs/alins?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/alinsjs/alins/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/alinsjs/alins?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/alins" target="_black">
        <img src="https://img.shields.io/npm/v/alins?logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/alins" target="_black">
        <img src="https://img.shields.io/npm/dm/alins?color=%23ffca28&logo=npm" alt="downloads" />
    </a>
    <a href="https://www.jsdelivr.com/package/npm/alins" target="_black">
        <img src="https://data.jsdelivr.com/v1/package/npm/alins/badge" alt="jsdelivr" />
    </a>
</p>

<p align="center">
    <a href="https://github.com/theajack" target="_black">
        <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://www.github.com/alinsjs/alins/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/alinsjs/alins?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/npm/alins"><img src="https://img.shields.io/bundlephobia/minzip/alins.svg" alt="Size"></a>
    <a href="https://github.com/alinsjs/alins/search?l=javascript"><img src="https://img.shields.io/github/languages/top/alinsjs/alins.svg" alt="TopLang"></a>
    <a href="https://github.com/alinsjs/alins/issues"><img src="https://img.shields.io/github/issues-closed/alinsjs/alins.svg" alt="issue"></a>
    <a href="https://www.github.com/alinsjs/alins"><img src="https://img.shields.io/librariesio/dependent-repos/npm/alins.svg" alt="Dependent"></a>
</p>

### 🚀 [Alins](https://github.com/alinsjs/alins): `Al`l-`in`-j`s` web ui框架，无 jsx/template/vdom/css/html

**[English](https://github.com/alinsjs/alins/blob/master/README.md) | [文档](https://theajack.github.io/alins) | [更新日志](https://github.com/alinsjs/alins/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/alinsjs/alins/issues/new) | [Gitee](https://gitee.com/alinsjs/alins) | QQ Group: 958278438 | [留言板](https://theajack.github.io/message-board/?app=alins)**

## 0 快速开始

### 0.1 npm

```
npm i alins
```

```js
import {div} from 'alins';
div('Hello World!').mount();
```

### 0.2 cdn

```html
<script src="https://cdn.jsdelivr.net/npm/alins"></script>
<script>
  Alins.div('Hello World!').mount();
</script>
```

## 1. 特性

1. 无vdom，监听数据精准修改到dom/textNode，dom节点复用
2. alins-style css-in-js方案，原子属性/积木式组合/样式响应变更
3. 良好的组件化支持
4. 支持for,if,show,switch,model控制器
5. 支持computed、watch
6. 单向数据流 + 双向绑定
7. 良好的ts支持

更多详细功能请参考[在线文档](https://shiyix.cn/alins)

## 2. 实例程序

### 2.1. 计数器 [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/count.js)

```js
import { button, comp, click, $, mount } from 'alins';

function Count () {
    const count = $(0);
    return button(
        click(() => {count.value++;}),
        $`Count is ${count}`
    );
}

comp(Count).mount();
```

### 2.2. 父子组件传参+model指令 [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/model.js)

```js
import {
    button, comp, prop, click, $, input, span,
} from '../alins';

export function Count () {
    const count = $(0);
    return [
        span('输入count'),
        input.model(count, 'number'),
        comp(CountProps, prop({value: count})),
        button('add', click(() => {count.value++;})),
    ];
};

export function CountProps ({props}) {
    return span($`Count is ${props.value}`);
}

comp(Count).mount();
```

## 3. todolist [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/todo-list.js)

```js
import {comp, button, div, input, click, $} from '../alins';
import {style} from '../alins-style';


export function todoList () {
    const edit = $('');
    const list = $([]);
    const addItem = () => {
        list.push({content: edit.value, done: false});
        edit.value = '';
    };
    const removeItem = (index) => { list.splice(index.value, 1); };
    const finishItem = (item) => { item.done = !item.done.value; };

    const itemStyle = (item) => {
        return style.textDecoration(() => item.done.value ? 'line-through' : 'none')
            .color(() => item.done.value ? '#888' : '#222');
    }

    return [
        input.model(edit),
        button('提交', click(addItem)),
        div('.todo-list',
            div.for(list)((item, index) => [
                itemStyle(item),
                $`${() => index.value + 1}:${item.content}`,
                button('删除', click(removeItem).args(index)),
                button(
                    $`${() => item.done.value ? '撤销' : '完成'}`,
                    click(finishItem).args(item)
                ),
            ]),
        ),
    ];
}
comp(todoList).mount();
```

## 4. css in js [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/style.js)

```js
import {
    div, $, css, style, button, hover, click, input, cls
} from 'alins';

function Style () {
    const num = $(30);
    const active = $(false);

    css('.main')(
        style({
            color: '#888',
            marginLeft: $`${num}px`,
        }),
        ['&.active', style.fontSize(num)],
        ['.child', style.marginTop(num)]
    ).mount();

    return div(`parent.main`,
        cls({active}),
        hover('color: #f44'),
        input.model(num, 'number'),
        button('toggle active', click(() => active.value = !active.value)),
        div('child.child'),
    );
}

mount(comp(Style));
```