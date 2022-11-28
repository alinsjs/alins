<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 12:19:34
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-28 09:03:53
-->

## v0.0.15

fix: wordWrap break-all [done]
fix: wordBreak break-word [done]
移除多余的log [feat]
fix: 删除多余的mergereact [fix]
feat: 原子样式支持 获取属性值 ._reslut.color ... [done]
feat: 控制器支持 computed

## TodoList

fix: 顺序问题 div(a('web-os'), ' made by ', a('theajack'))
fix: .show(() => list.length > 0) (webos input-item 中)
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


fix: 
        const result = !!name ? (info.filter(item => item.commandName === name) || []) : info;
        div.for(result) 会引起报错


feat: emment 使用函数或特殊标记控制 默认字符串和数字 使用 text逻辑
feat: css 动画 规则
feat: for 大列表性能优化 考虑使用memo + shallowProxy
feat: list = [] 之后内存没有被回收
feat: 原子样式 组合样式 扩充
feat: 状态管理
feat: 路由
feat: ui组件
feat: comment and jsbox 英文版本