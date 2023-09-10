
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

## 🚀 [Alins](https://github.com/alinsjs/alins): The most pure and elegant WebUI framework

**[中文](https://github.com/alinsjs/alins/blob/master/README.cn.md) | [Documentation](https://alinsjs.github.io/docs) | [Playground](https://alinsjs.github.io/playground/) | [Update Log](https://github.com/alinsjs/alins/blob/master/scripts/helper/version.md) | [Feedback Errors/Defects](https://github.com/alinsjs/alins/issues/new) | [Gitee](https://gitee.com/alinsjs/alins) | [Message Board](https://theajack.github.io/message-board/?app=alins)**

## 0 Introduction

### 0.1 Preface

Alins is an extremely pure, simple, and elegant web UI framework. It adheres to the development philosophy of 0-API and Less is More, aiming to help developers escape the dilemma of complex API calls in UI frameworks and provide the most intuitive, pure, and close-to-vanillajs development approach.

You only need to understand the syntax rules of JSX (similar to HTML) to develop Alins web applications without any obstacles. Below is a basic counter example that you can [experience online in the playground](https://alinsjs.github.io/playground/#4):

```jsx
let count = 1;
<button onclick={count++} $mount='#App'>
     count is {count}
</button>;
```

### 0.2 Features

1. [x] 0-API, Less is More, closest to native JavaScript development.
2. [x] Powerful reactivity, supports reactive updates for properties, styles, text, HTML, and other elements.
3. [x] High performance (superior to Vue3 and React).
4. [x] Does not use virtual DOM (vdom), directly updates UI at a granular level.
5. [x] Extremely small runtime and bundle size (better than Vue3 and React).
6. [x] Supports two-way data binding, component development, and follows a unidirectional data flow.
7. [x] Built-in data sharing solution, easily manages shared data among components.
8. [x] Rich ecosystem support, compatible with plugins such as Vite, Rollup, Webpack, and esbuild. It can also customize third-party tools based on the underlying compilation module.
9. [x] Supports if and switch logic, as well as If, Switch, For, and other logical components.
10. [x] Supports custom renderers for cross-platform development.
11. [x] Uses JSX and TSX to describe UI, with built-in TypeScript compilation support.
12. [x] Developed using TypeScript, with highly friendly type support.

### 0.3 TODO

The following peripheral tools are currently under development, and we also hope that interested developers can participate together:

1. [ ] [alins-router](https://github.com/alinsjs/alins-router): Single-page application routing solution
2. [ ] [alins-ssr](https://github.com/alinsjs/alins-ssr): Server-side rendering solution
3. [ ] [alins-ui](https://github.com/alinsjs/alins-ui): Official UI library (consider implementing ant-design or meterial-design)
3. [ ] [alins-v](https://github.com/alinsjs/alins-v): Official form validation library
4. [ ] [alins-term](https://github.com/alinsjs/alins-term): Tool for developing command line applications based on custom renderers
5. [ ] [alins-canvas](https://github.com/alinsjs/alins-canvas): Tool for developing applications with canvas based on custom renderers

## 1 Quick Start

### 1.1 Command line creation

```
npm create alins
```

After following the steps, execute the following command to install and run it.

```
cd <project>
npm i
npm rundev
```

You can also directly clone the [template code repository](https://github.com/alinsjs/ebuild-template-alins)

### 1.2 Using the Web Compiler

```html
<script src='https://cdn.jsdelivr.net/npm/alins-compiler-web'></script>
<script type='text/alins'>
     let count = 1;
     <button onclick={count++} $$body>
         count is {count}
     </button>;
</script>
```

Note:
1. This approach is not recommended for production environments.
2. You can use type='text/babel' to enable syntax highlighting provided by the editor.

You can also freely use it in the [playground](https://alinsjs.github.io/playground/#48), which also utilizes a web compiler.

## 2 Compare

### 2.1 [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) data

![](https://shiyix.cn/images/alins/performance.jpg)

Note: The lower the score, the better the performance.

### 2.2 Code comparison

![](https://shiyix.cn/images/alins/code.jpg)

### 2.3 Comparing the Compilation Products. 

![](https://shiyix.cn/images/alins/output.jpg)

Organizing a table to comprehensively compare the source code volume, packed code volume, and framework runtime volume of various products.

| metrics | alins | vue3 | react |
| :----: | :----: | :----: | :----: |
| Source size | 90byte | 281byte | 302byte |
| Compiled product size | 140byte | 620byte | 435byte |
| Runtime Size | 26.6kb | 474kb | 139kb |
| Startup Metrics   |   1.24    | 2.74 | 1.52 |
| Runtime Performance   |   1.36    | 1.45 | 1.54 |
| Memory Usage   |   2.77    | 3.30 | 3.28 |

Note: This comparison is only for the current counter example and is for reference only

## 3 Documentation

Please refer to the following online documentation

[English](https://alinsjs.github.io/docs/) | [中文](https://alinsjs.github.io/docs-cn/)