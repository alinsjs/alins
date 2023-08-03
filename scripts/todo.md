<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 12:19:34
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-04 01:12:54
-->

# 0.1.0

feat：

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
- [ ] 文档
- [ ] babel-alins插件，webpack、rollup、vite插件
- [ ] For、async组件 data数据处理，识别不到data定义 (eslint-config解决)
- [ ] 编译 + 运行时 结合测试
- [ ] typescript 支持

new feature

- [ ] For Object 支持
- [ ] $if $elif $else $case $default 属性支持
- [ ] style 标签优化 处理 提高css可用性, style 值类型声明

fix

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
- [ ] fix: cache 节点 失效的问题，如何更新cache: 缓存的节点中有if，if节点变更导致缓存失效了
- [ ] fix: If 标签之后的节点不见了
- [ ] 多层嵌套if问题
<!-- - [ ] 多层嵌套的reactive -->





<!-- ## TodoList

- [ ] comp.for(Comp)((item, index)=>[prop({...item})]) // ts 报错
- [ ] comp.for(Comp)((item, index)=>[prop({item})]) // 当item是一个object时不支持
- [ ] IReactWrap 作为默认 ts 类型
- [ ] .box-back,.box-close, ['&:hover'] 没有两个都分配到
- [ ] IReactWrap 类型推倒
- [ ] right: $`${() => isMin.value ? 0 : 500}`, 不支持
- [ ] div 方法 参数传 dom元素会报错
- [x] 修复 comp.for 必须要带参数的bug
- [x] fix: .show(() => list.length > 0) (webos input-item 中)
        div.show(Hint.enabled)(
            style.color('#777').marginTop(5),
            span.show(() => !!Hint.text.value)(text($`Hint: ${Hint.text}`)),
            div(
                span.show(() => Hint.list.length > 0)('options:'),
                span.for(Hint.list)(item => [
                    style.marginRight(20),
                    text(item)
                ])
            )
        ),
- [x] feat: list = [] 之后内存没有被回收
- [x] fix: 顺序问题 div(a('web-os'), ' made by ', a('theajack'))


- [x] fix: 
        const result = !!name ? (info.filter(item => item.commandName === name) || []) : info;
        div.for(result) 会引起报错


feat: emment 使用函数或特殊标记控制 默认字符串和数字 使用 text逻辑
feat: css 动画 规则

feat: for 大列表性能优化 考虑使用memo + shallowProxy

feat: 原子样式 组合样式 扩充
feat: 状态管理
feat: 路由
feat: ui组件
feat: comment and jsbox 英文版本 -->