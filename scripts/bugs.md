<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-05 12:19:34
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 13:51:02
-->

fix: 对于arg传入函数出现的bug fix [done]
fix: object reactive subscrube [done]
fix: 数组重新赋值之后属性丢失，下标引用绑定丢失 [done]
input builder & moduelReturn 支持 mount [done]
feat: dom 支持直接使用 react数据作为textContent [done]
fix: comp和dom builder使用函数作为参数 [done]


fix: 对象赋不同的结构的值之后丢失

## v0.0.11

feat: comp 科里化 comp(Hello)() [done]
fix: 文本中 . [] # / 不显示 : / [] 字符串冲突问题 [done] 使用text方法
fix: alins-utils ts 声明文件问题 [done]
fix: subscribe return value; [done]
feat: atomStyle 新增 join 方法 [done]
fix: 事件声明 不起作用 [done]
feat: click.stop 简化写法 [done]
del: splitTwoPart 函数重复 [done]
fix: 修复兼容属性重复补全问题 [done]
feat: 1.声明提示优化 TType & {[prop: string]: any;} [done]
feat: 2. 通过重载支持string和枚举共存 [done]
fix: style 多数据绑定中绑定报错的问题 [done]
feat: model 支持通过识别 type=number来增加number修饰符 [done]
fix: 修复对象类型和computed组合使用时 闭包对象数值不更新问题 [done]

## v0.0.12 todo

for 大列表性能优化 考虑使用memo + shallowProxy