<!--
 * @Author: tackchen
 * @Date: 2022-10-23 21:15:35
 * @Description: Coding something
-->

<p align="center">
    <img src='https://shiyix.cn/images/alins.png' width='100px'/>
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
    <img src="https://shiyix.cn/api2/util/badge/stat?c=Visitors-Alins" alt="visitors">
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

## 🚀 [Alins](https://github.com/alinsjs/alins): 最纯粹优雅的WebUI框架

**[English](https://github.com/alinsjs/alins/blob/master/README.md) | [文档](https://alinsjs.github.io/docs-cn) | [演练场](https://alinsjs.github.io/playground/) | [更新日志](https://github.com/alinsjs/alins/blob/master/scripts/helper/version.md) | [反馈错误/缺漏](https://github.com/alinsjs/alins/issues/new) | [Gitee](https://gitee.com/alinsjs/alins) | [留言板](https://theajack.github.io/message-board/?app=alins)**

## 0 简介

### 0.1 前言

Alins是一款极致纯粹、简洁、优雅的Web UI框架。秉持0-API、Less is More 的开发理念，旨在帮助开发者摆脱UI框架繁杂的API调用困境，以最直观、最纯粹、最贴近vanillajs的开发方式。

您只需要了解jsx的书写规则（类似html的语法）便可以没有任何阻碍的开发 alins web应用，下面是一个最基本的计数器示例，你可以[在演练场中在线体验](https://alinsjs.github.io/playground/#4)：

```jsx
let count = 1;
<button onclick={count++} $mount='#App'>
    count is {count}
</button>;
```

### 0.2 特性

1. [x] 0-API、Less is More，最贴近原生js开发
2. [x] 强大的响应式能力，支持属性、样式、文本、html等元素的响应式更新
3. [x] 具有极高的性能（优于Vue3、React）
4. [x] 未使用vdom，直接细粒度变更UI
5. [x] 具有极小的运行时体积和打包体积（优于Vue3、React）
6. [x] 支持双向数据绑定，支持组件开发，遵循单项数据流
7. [x] 内置数据共享方案，可以轻松的管理组件共享数据
8. [x] 丰富的周边生态支持，支持 vite、rollup、webpack、esbuild等插件，同时可以基于底层编译模块定制第三方工具
9. [x] 支持if、switch逻辑，同时支持 If、Switch、For等逻辑组件
10. [x] 支持自定义渲染器实现跨平台开发
11. [x] 使用jsx、tsx描述UI，内置typescript编译支持
12. [x] 使用ts开发，高度友好的类型支持

### 0.3 TODO

以下周边工具正在开发中，也希望感兴趣的开发者可以一起参与进来

1. [ ] [alins-router](https://github.com/alinsjs/alins-router)：单页面应用程序路由方案
2. [ ] [alins-ssr](https://github.com/alinsjs/alins-ssr)：服务端渲染方案
3. [ ] [alins-ui](https://github.com/alinsjs/alins-ui)：官方UI库 （考虑实现ant-design或者meterial-design）
3. [ ] [alins-v](https://github.com/alinsjs/alins-v)：官方表单验证库
4. [ ] [alins-term](https://github.com/alinsjs/alins-term)：基于自定义渲染器开发命令行应用程序的工具
5. [ ] [alins-canvas](https://github.com/alinsjs/alins-canvas): 基于自定义渲染器开发使用canvas渲染ui的应用程序的工具

## 1 快速开始

### 1.1 命令行创建

```
npm create alins
```

按照步骤执行完成之后，执行以下命令便可以安装运行起来了

```
cd <project>
npm i
npm run dev
```

您也可以直接克隆 [模版代码仓库](https://github.com/alinsjs/ebuild-template-alins)

### 1.2 使用Web编译器

```html
<script src='https://cdn.jsdelivr.net/npm/alins-compiler-web'></script>
<script type='text/alins'> 
    let count = 1;
    <button onclick={count++} $$body>
        count is {count}
    </button>;
</script>
```

注：
1. 该方式不建议在生产环境使用
2. 可以使用 type='text/babel'，这样可以获得编辑器自带的语法高亮

您也可以在 [演练场](https://alinsjs.github.io/playground/#free) 中自由使用，演练场也是使用Web编译器

## 2 比较

### 2.1 [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) 数据

![](https://cdn.jsdelivr.net/gh/alinsjs/alins/scripts/helper/docs/performance.jpg)

注：分数越低表示性能越好

### 2.2 代码对比

![](https://cdn.jsdelivr.net/gh/alinsjs/alins/scripts/helper/docs/code.jpg)

### 2.3 编译产物对比

![](https://cdn.jsdelivr.net/gh/alinsjs/alins/scripts/helper/docs/output.jpg)


综合源码体积、打包代码体积和框架运行时体积，整理出表格

|  指标   |      alins      |  vue3 | react |
| :----: | :----: | :----: | :----: | 
| 源码体积     | 90byte | 281byte | 302byte |
| 编译产物体积  | 140byte | 620byte | 435byte |
| 运行时体积   |   26.6kb    | 474kb | 139kb |
| 体积评分   |   1.24    | 2.74 | 1.52 |
| 运行时性能   |   1.36    | 1.45 | 1.54 |
| 内存占用评分   |   2.77    | 3.30 | 3.28 |

注：该比较仅针对当前计数器示例，仅作参考

## 3 文档

请参考以下在线文档

[English](https://alinsjs.github.io/docs/) | [中文](https://alinsjs.github.io/docs-cn/)