/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:07:24
 * @Description: Coding something
 */
let React, $,div,span,_jsx, react

/*
对于简单类型：let or var 且被重新赋值的变量 [且被试图|computed|watch|observe引用](暂时可以不考虑)
对于复杂类型：被赋值或者属性被赋值 [且被试图|computed|watch|observe引用](暂时可以不考虑)
*/

function HelloWorld () {
  let className = '11';
  const list = [1,2,3]

  return <div
    style={{}} class={className} onclick={()=>{className = 'xx'}}
  >
    <span onclick={()=>{className = 'xx'}}>
      <div></div>
    </span>
    { list.map(item => <div>{item}</div>) }
  </div>
}

function HelloWorld2 () {
  let className = '11';
  const list = [1, 2, 3];
  return _jsx("div", {
    style: {},
    class: className,
    onclick: () => {
      className = 'xx';
    },
    children: [
      _jsx("span", {
        onclick: () => {
          className = 'xx';
        },
        children: _jsx("div", {})
      }), 
      list.map(item => _jsx("div", {
        children: item
      }))
    ]
  });
}

function HelloWorld3(){
  let className = react('11'); // 因为后续代码中对这个赋值了
  const list = [1,2,3]

  return div({ 
    style: {}, class: $`${className}`, onclick: ()=>{className.value = 'xx'}
  }, 
    span({onclick: () => {className.value = 'xx';}}, 
      div({})
    ),
    list.map(item => div(item))
  );
}

function createState(){
  return {
    className: '11',
  }
}