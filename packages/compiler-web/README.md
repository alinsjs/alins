
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

# Alins Web Compiler

Alins provides a browser environment compiler that can be used for development and debugging. Since it is compiled directly in the browser environment, it is not recommended to be used directly in the production environment.

## 1. Use

Save the following code in an html file to compile and run the alins application directly in the browser environment:

<CodeBox :iframe='true' :height='40' :html='true'/>

```html
<!DOCTYPE html>
<html lang="en">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
</head>
<body>
     <script src='https://unpkg.com/alins-compiler-web'></script>
     <script type='text/alins'>
         let count = 1;
         <button onclick={count++} $$body>
             count is {count}
         </button>;
     </script>
</body>
</html>
```

## 2. type attribute

The web compiler can recognize three types, `text/alins`, `text/babel`, `text/jsx`, and compile and execute the code in them.

## 3. import attribute

You can use the import attribute to top the import statement. The optional values are:

1. esm: means using the import statement to introduce alins
2. cjs: means using the require method to introduce alins
3. iife means importing alins from window.Alins, the default value is iife

How to use it

```html
<script type='text/alins' import="esm">
     let count = 1;
     <button onclick={count++} $$body>
         count is {count}
     </button>;
</script>
```

## 4. ts attribute

The ts attribute is used to determine whether to use typescript

The opening method is as follows

```html
<script type='text/alins' ts>
     let count: number = 1;
     <button onclick={count++} $$body>
         count is {count}
     </button>;
</script>
```