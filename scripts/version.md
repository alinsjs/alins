<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 09:30:54
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-12 16:28:28
-->
## v0.0.12

1. feat: 修复 组件 + show同时使用时初始化渲染问题 [done]

## v0.0.11

1. feat: comp 科里化 comp(Hello)() [done]
2. feat: click.stop 简化写法 [done]
3. feat: atomStyle 新增 join 方法 [done]
4. feat: 声明提示优化 TType & {[prop: string]: any;} [done]
5. feat: 通过重载支持string和枚举共存 [done]
6. feat: model 支持通过识别 type=number来增加number修饰符 [done]
7. fix: 文本中 . [] # / 不显示 : / [] 字符串冲突问题 [done] 使用text方法
8. fix: alins-utils ts 声明文件问题 [done]
9. fix: subscribe return value; [done]
10. fix: 事件声明 不起作用 [done]
11. del: splitTwoPart 函数重复 [done]
12. fix: 修复兼容属性重复补全问题 [done]
13. fix: style 多数据绑定中绑定报错的问题 [done]
14. fix: 修复对象类型和computed组合使用时 闭包对象数值不更新问题 [done]

## 0.0.10 

1. 修复ts声明文件引用错误问题

## 0.0.9

1. input builder & modelReturn 支持 mount 
2. feat: dom 支持直接使用 react数据作为textContent 
3. fix: comp和dom builder使用函数作为参数 
4. fix: style 多数据绑定中绑定报错的问题

## 0.0.8

1. fix: div('.class', 'text').mount(); 文本节点不渲染 的bug 
2. feat: mount可以挂载到 其他节点或者 comp上
3. feat: 事件中访问 this dom 
4. fix: On 函数设计有误 
5. fix: 对于arg传入函数出现的bug fix
6. fix: object reactive subscrube 
7. fix: 数组重新赋值之后属性丢失，下标引用绑定丢失
   
## 0.0.7

1. 增加controller mount功能
2. 增加html builder
3. 修复if bug
4. for callback返回支持单个builder

## 0.0.6

1. 导出 IReactObject IComputedItem
2. fix for循环bug
3. fix 对象、数组直接赋值bug
4. 增加一级对象直接赋值功能

## 0.0.1-0.0.5 

1. 初始版本