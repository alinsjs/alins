<!--
 * @Author: chenzhongsheng
 * @Date: 2022-10-30 02:42:04
 * @Description: Coding something
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-04 00:03:48
-->
## v0.0.17

1. Fix the space problem in text
2. Zero-width assertion compatible processing
   
## v0.0.16

1. fix: array length problem
2.css Styles support multiple CSS ('.aa') (['.a1,.a2', style.color(111)])
3. Support text builder numbers and text in the same order div(span('web-os'), ' :22.cc:44 ', text(' made by '), '33', text('11')).mount();

## v0.0.15

fix: wordWrap break-all [done]
fix: wordBreak break-word [done]
Remove excess log [feat]
fix: Remove redundant mergereact [fix]
feat: atomic style added get method, support for getting property values ._reslut.color ... [done]
feat: The controller supports computed
feat: Supports dynamic listening of array lengths

## v0.0.13-v0.0.14

1. feat: style: supporteAdoptedStyle supports configuring to turn useAdoptedStyle [done] on or off
2. feat: CSS functions support passing in json, and there is a support prompt [done]
3. feat: style enumeration attribute hint [done]
4. fix: Atomic attribute missing minWidth minHeight [done]
5. FIX: Complete the TS statement
   
## v0.0.12

1. feature: fix the problem of initializing rendering when components+show are used together [done]

## v0.0.11

1. feat: comp Coriolization comp(Hello)()[done]
2. feat: click. stop Simplified Writing [done]
3. feat: atomStyle adds a join method [done]
4. feat: declaration prompt to optimize TType&{[prop: string]: any;} [done]
5. feat: Support coexistence of string and enumeration through overloading [done]
6. feature: The model supports adding the number modifier [done] by identifying type=number
7. fix: In the text. [] #/Do not display:/[] String conflict problem [done] Use the text method
8. fix: problems with the alins utils ts declaration file [done]
9. fix: subscribe return value;  [done]
10. fix: event declaration does not work [done]
11. The del: splitTwoPart function repeats [done]
12. fix: fix the problem of repeated completion of compatible attributes [done]
13. Fix: style The problem of binding error in multi data binding [done]
14. fix: fix the problem that the closure object value is not updated when the object type and computed are used together [done]


## 0.0.10 

1. Fix the reference error of ts declaration file


## 0.0.9

1. Input builder&modelReturn supports mount
2. feat: dom supports direct use of react data as textContent
3. Fix: comp and dom builder use functions as parameters
4. The problem of binding error in fix: style multi data binding


## 0.0.8
1. fix: div('.class', 'text'). mount();  Bugs that text nodes do not render
2. feat: mount can be mounted to other nodes or comps
3. fee: access this dom in the event
4. Fix: On function design error
5. fix: fix the bug in the arg incoming function
6. fix: object reactive subscrube 
7. fix: The attribute is lost after the array is reassigned, and the subscript reference binding is lost


## 0.0.7
1. Add controller mount function
2. Add html builder
3. Fix if bug
4. For callback returns support for a single builder

## 0.0.6

1. Export IReactObject ICompletedItem
2. Fix for loop bug
3. Fix object and array direct assignment bug
4. Add the function of direct assignment of primary objects

## 0.0.1-0.0.5 

1. Initial version