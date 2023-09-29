
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

# Alins Standalone

Alins provides a compilation-free toolkit. Through some API calls, complete Alins application functions can be realized, but jsx syntax cannot be used.

## 1. Installation and use

npm installation and use

```
npm i alins-standalone
```

```js
import {/**import**/} from 'alins-standalone';
```

```js
<script src='https://unpkg.com/alins-standalone'></script>
<script>
     window.Alins;
</script>
```

## 2.API

alins-standalone exports the following API, the basic usage is consistent with alins

```js
import {
    mount, ref, reactive, watch, computed,
    If, ElseIf, Else,
    Switch, Case, Default,
    For, Async, Show, Dom, Component,
    created, appended, mounted, removed,
} from 'alins-standalone';
```

The counter program above can be expressed using Alins Standalone:

```js
import { ref, computed, Dom, join } from 'alins-standalone';

const count = ref(1);
const countAdd1 = computed(() => count.v + 1);
Dom.button({
    $mount: 'body',
    onclick: () => count.v++,
}, join`count is ${count}; countAdd1 is ${countAdd1}`);
```

Let’s use the cdn method and learn about it through an example.

```html
<script src='https://unpkg.com/alins-standalone'></script>
<script>
const { ref, computed, Dom, join } = window.Alins;
const count = ref(1);
const countAdd1 = computed(() => count.v + 1);
Dom.button({
    $mount: 'body',
    onclick: () => count.v++,
}, join`count is ${count}; countAdd1 is ${countAdd1}`);
</script>
```

Note: The join api means splicing a string with responsive data and returning an array. You can also use the array form directly

```js
['count is ', count, '; countAdd1 is ', countAdd1]
```

For specific usage of other APIs, please refer to [alins-standalone.d.ts](https://unpkg.com/alins-standalone/dist/alins-standalone.d.ts)