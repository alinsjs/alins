
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

## [alins-compiler-core](https://www.npmjs.com/package/alins-compiler-core)

Compiler core module, basically developers do not need to use this module.

This module can generate a universal babel plug-in that supports use in web and nodejs environments. The alins-compiler-node above and the web compiler in subsequent chapters all rely on this module.

```js
import {createBabelPluginAlins} from 'alins-compiler-core';
const babelPlugin = createBabelPluginAlins();
```