<!--
 * @Author: chenzhongsheng
 * @Date: 2022-11-03 09:30:54
 * @Description: Coding something
 * @LastEditors: chenzhongsheng
 * @LastEditTime: 2022-11-09 22:23:17
-->

## 0.0.10 

1. 修复ts声明文件引用错误问题
   
## 0.0.9

1. input builder & moduelReturn 支持 mount [done]
2. feat: dom 支持直接使用 react数据作为textContent [done]
3. fix: comp和dom builder使用函数作为参数 [done]
4. fix: style 多数据绑定中绑定报错的问题

## 0.0.8

1. fix: div('.class', 'text').mount(); 文本节点不渲染 的bug 
2. feat: mount可以挂载到 其他节点或者 comp上
3. feat: 事件中访问 this dom 
4. fix: On 函数设计有误 
5. fix: 对于arg传入函数出现的bug fix [done]
6. fix: object reactive subscrube [done]
9. fix: 数组重新赋值之后属性丢失，下标引用绑定丢失 [done]

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