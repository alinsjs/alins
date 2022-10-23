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

**[English](https://github.com/alinsjs/alins/blob/master/README.en.md) | [文档](https://theajack.github.io/alins) | [更新日志](https://github.com/alinsjs/alins/blob/master/helper/version.md) | [反馈错误/缺漏](https://github.com/alinsjs/alins/issues/new) | [Gitee](https://gitee.com/alinsjs/alins) | QQ Group: 958278438 | [留言板](https://theajack.github.io/message-board/?app=alins)**

## 0 快速开始

### 0.1 npm

```
npm i alins
```

```js
import {mount, div} from 'alins';
mount(div('Hello World!'));
```

### 0.2 cdn

```html
<script src="https://cdn.jsdelivr.net/npm/alins"></script>
<script>
  const {mount, div} = window.Alins;
  mount(div('Hello World!'));
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
import {
    button, div, comp, click, react
} from 'alins';

function main(){
  mount(comp(Count));
}

function Count () {
    const count = react(0);
    return button(
        click(() => {count.value++;}),
        react`:Count is ${count}`
    );
}
```

### 2.2. 父子组件传参+model指令 [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/model.js)

```js
import {
    span, input, mount, div, react
} from 'alins';
import {css, style} from 'alins-style';

function main() {
    const size = react(12);
    const color = react('#222');

    initCss(size, color);

    mount([
        div(
            span('修改size:'),
            input.model(size)(),
        ),
        div(
            span('修改颜色:'),
            input.model(color)(),
        ),
        div('文本', style({
            color, fontSize: size
        })),
        div('.parent',
            div('.child:文本2')
        )
    ]);
}

function initCss (size, color) {
    return css('.parent',
        style.borderBottom(react`${size}px solid ${color}`),
        ['.child',
            style({color, fontSize: size})
        ],
    );
}
```

## 3. todolist [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/todo-list.js)

```js
import {
    button, input, div, comp, click, react
} from 'alins';

function main(){
  mount(comp(todoList));
}

function todoList () {
    const edit = react('');
    const list = react([]);
    const addItem = () => {
        list.push({content: edit.value});
        edit.value = '';
    };
    const removeItem = (index: IReactItem) => {
        list.splice(index.value, 1);
    };
    return div(
        input.model(edit)(),
        button(':提交', click(addItem)),
        div('.todo-list', react`.todo-${edit}`,
            div.for(list)((item, index) => [
                react`${() => index.value + 1}:${item.content}`,
                button(':删除', click(removeItem).args(index)),
            ]),
        ),
    );
}
```

## 4. css in js [在线使用](https://shiyix.cn/jsbox?github=alinsjs.alins.scripts/samples/style.js)

```js
import {
    button, input, div, comp, click, react
} from 'alins';

function main(){
  mount(comp(todoList));
}

function todoList () {
    const edit = react('');
    const list = react([]);
    const addItem = () => {
        list.push({content: edit.value});
        edit.value = '';
    };
    const removeItem = (index: IReactItem) => {
        list.splice(index.value, 1);
    };
    return div(
        input.model(edit)(),
        button(':提交', click(addItem)),
        div('.todo-list', react`.todo-${edit}`,
            div.for(list)((item, index) => [
                react`${() => index.value + 1}:${item.content}`,
                button(':删除', click(removeItem).args(index)),
            ]),
        ),
    );
}
```

todolist:
1. 自定义控制器
2. 原子属性扩展
3. ts声明完善
4. 自定义渲染器
5. 路由方案