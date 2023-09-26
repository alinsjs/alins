<!--
 * @Author: chenzhongsheng
 * @Date: 2023-09-07 14:58:05
 * @Description: Coding something
-->

### Plan

- [ ] alins-router - 官方路由库 （尽可能通用 能够直接使用原生js调用）
- [ ] alins-ui - 官方ui库
- [ ] alins-style style 标签优化 处理 提高css可用性, style 值类型声明 （能够使用reactive库配合着使用原生js使用）
- [ ] alins-style 支持兼容性扩展
- [ ] alins-ssr - 服务端渲染（尽可能通用 能够直接使用原生js调用）
- [ ] 增加 变量声明和函数参数的 @reactive，增加 @static 注释
- [ ] For 支持解构
- [ ] For Object 支持
- [ ] source-map 支持
- [ ] 编译器代码重构 - 分两步编译 第一步进行jsx解析；第二部进行alins reactive； 支持 ssr
- [ ] 运行时代码重构 - 优化内存空间占用和运行时间
- [ ] 完善测试
- [ ] Branch 内存占用问题
- [ ] For 类型提示
- [ ] Async Data 类型标注
- [ ] alins-vsc

## 0.0.35 Doing

- [x] alins-standalone 优化Api，使其更易用
- [x] fix 组件参数中 传递方法的bug
- [ ] 模版语法支持 html 文件作为模版语言
- [ ] computed 重构；dirty 标记。优化 const b = a++; 逻辑
- [ ] 生命周期优化，支持组件内使用；+ 语法糖 $remove:el,xxx();
- [ ] 大列表排序时移动dom元素优化性能

## 0.0.33 - 0.0.34

- [x] fix nodejs 环境下使用
- [x] fix computed 

## 0.0.32

- [x] 支持 commonjs 导入 alins
- [x] _、$ label支持
- [x] static_scope label支持 
- [x] $if $elif $else 属性支持
- [x] $switch $case $default 属性支持
- [x] $for、$async 属性支持
- [x] if 混合使用 switch 混合使用
- [x] Frag 组件支持

## 0.0.31

- [x] 去除type module
- [x] fix alins jsx declare
- [x] 删除未使用的工具函数

## 0.0.30

- [x] fix alins-standalone
- [x] if、switch、map语句支持 @static-scope 注释
- [x] fix const age1 = age ++; fix了报错，但是逻辑上不应如此使用
- [x] 组件支持生命周期函数
- [x] className 去重
- [x] fix: 单文件class和单文件style的优先级问题
- [x] fix: Array as children
- [x] 增加 outerHTML属性

## 0.0.29

- [x] 增加 js表达式作为事件是 $e 参数
- [x] 修复 for of for in 中错误的初始值的问题
- [x] 新增 watch: 语法糖
- [x] 新增 defineRenderer, useRenderer
- [x] 新增静态函数，跳过对函数内元素做处理 _ 前缀和 @static-scope 标记
- [x] store watch 支持属性链 a.b
- [x] fix 生命周期在branch-block中的bug

## 0.0.18 - 0.0.28

- [x] Branch 元素父子关系
- [x] switch case 完善
- [x] map 编译器
- [x] style 简单处理
- [x] v-model：直接使用动态value属性和html输入类型标签来默认处理掉，不需要有v-model的语义
- [x] 组件属性 reactive传递; 组件传递map的item和index的时候reactive保持
- [x] 使用jsx属性命名空间做装饰器 用于model
- [x] 命名空间做装饰器 用于event装饰器
- [x] 重构 skip 逻辑，按需skip节点，不对新节点进行skip
- [x] For、If、Switch、async 组件封装
- [x] For、If、Switch、async 类型声明
- [x] $attributes 属性 类似style的对象赋值 键可以reactive // 待继承与测试
- [x] show 标签，$show属性
- [x] model 支持 object的属性
- [x] alins客户端直接使用封装api
- [x] alins-web-compiler web侧编译器
- [x] alins-node-compiler web侧编译器
- [x] 去除 /*#__PURE__*/ comment
- [x] node-compiler 增加 import 'alins'
- [x] babel、babel-preset，webpack-loader、rollup-plugin、vite-plugin、esbuild-plugin
- [x] For、async组件 data数据处理，识别不到data定义 (eslint-config解决)
- [x] alins-cli、alins-template （base on vite、vite-plugin-alins、eslint-config）
- [x] 重新走一下测试脚本
- [x] 编译 + 运行时 结合测试
- [x] class支持对象
- [x] 与react vue 性能比较
- [x] 利用 MutationObserver 实现生命周期
- [x] if switch 的 mnr 包裹
- [x] 当赋值是jsx时 无需reactive
- [x] 函数的reactive传递 const isActive = (i: number) => naviIndex === i; isActive => ()=>isActive
- [x] 增加变量定义的 reactive 注解，支持static注解
- [x] 下划线开头的变量表示 static
- [x] 属性扩展运算符处理
- [x] class:a=true 支持
- [x] $src => src={src} // 简化写法
- [x] $mount 简化写法; $$App $$body
- [x] if 和 switch 优化 (没有返回jsx的if和switch不进行处理)
- [x] import的header没有使用到就删除掉
- [x] 事件简化处理 onclick={a(1)} onclick={a++} 要考虑 a(1) 返回值是函数的情况 (pure 装饰器标注的不会处理)
- [x] 只有 扩展属性fix；component 扩展属性加 computed
- [x] $ref实现
- [x] style 支持数字 （默认px）
- [x] 支持了逻辑组件的属性简写 
- [x] 支持 使用 onclick:stop 不带事件名
- [x] 组件属性结构
- [x] 去除 .r 需要v的包裹
- [x] 发包脚本
- [x] 多层嵌套的if有问题； if switch 待重构
- [x] alins-compiler-web 将babel模改后直接引入 // 现在存在type="text/babel"直接babel被执行了
- [x] 文档 & 在线编译工具
- [x] 重构branch、if、switch、ctx逻辑
- [x] 清理编译器ctx下相关逻辑
- [x] create-alins 开发

### fix

- [x] fix map 逻辑
- [x] fix ctx 嵌套逻辑
- [x] 没有用到的ctx没有被移除
- [x] jsx scope bug，原因是jsx转换是从最里层开始的；通过引入一个jsxNodesStack解决
- [x] append jsx component error
- [x] jsx 元素赋值也会被 computed : const x = <i onclick=()=>{i++}>11</i> => x.v; (利用skipReadV解决)
- [x] fix: jsx 直接返回jsx时map未处理的问题
- [x] input 类型的 value，checked 被赋值时需要reactive
- [x] for 时 没有处理到 index和 item的computed
- [x] for 时 元素相同时 index不更新
- [x] for 时 子元素顺序问题 <for><span>{item}</span><br/>xx</for> map 没有将文本节点选为挂载节点
- [x] fix: computed get set时获取任意属性都为get的问题
- [x] fix: if 没有 elseif和else的情况 没有else情况的ui显示异常问题
- [x] fix: if 组件 多层嵌套执行有问题 (anchor start指向有问题)
- [x] fix: branch visible判断的逻辑问题，原因在于branch visit 时没有对
- [x] fix: cache 节点 失效的问题，如何更新cache: 缓存的节点中有if，if节点变更导致缓存失效了(初步解决)
- [x] fix: If 标签之后的节点不见了 (原因：if 编译时多删除了一个)
- [x] class 绑定数据有bug class = {bool?'a':'b'}
- [x] 数组直接赋值有bug，不能更新
- [x] 数组 swapRows 有bug
- [x] create 10000rows 有bug
- [x] 内存泄漏的问题 导致内存占用
- [x] 非数组非json大数据代理问题导致的性能问题 
- [x] fix 对象类型 Update操作时没有reactive的问题
- [x] fix comment reactive 标注
- [x] 空属性会报错
- [x] style={`color: ${status.syntaxError ? '#f44' : 'inherit'}`} 有bug
- [x] 修复 UpdateExpression 在jsx属性中引起循环引用的问题  <div  a={a++}></div>;
- [x] 修复 for component 使用嵌套数据无法正确编译的bug 
- [x] 组件属性 结构 与响应式fix
- [x] style:xxx 报错
- [x] a[x] 其中的 x不支持 .v 期望 a[x.v]
- [x] store 支持 数组 for
- [x] fix lifecycles
- [x] fix if直接引用for的场景 <If><For>...</For></If>
- [x] fix $ref reactive 影响；const 转换
- [x] fix for-component cacheManager 
- [x] fix: style:padding='3px 5px'
- [x] 重命名 $dom => $ref，$parent = $mount
- [x] enable attribute;
- [x] fix todo list 删除有问题
- [x] fix 注释行号比对的bug 
- [x] fix switch cacheManager

## 0 - 0.0.18

初始版本