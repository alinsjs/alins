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

function hh(){
  let div = null;
  if(a){
    return <div>11</div>;
  }else{
    div = <div>22</div>;
  }

  console.log(11);

  return <div>{div}</div>
}

function hh(){
  let div = null;
  const r = $if(a, ()=>{
    return div(11);
  }).else(()=>{
    div = div(22);
  })
  if(r) return r;

  console.log(11);

  return <div>{div}</div>
}

function hh(){
  let div = null;
  switch(a){
    case 1: div = <div>11</div>; break;
    case 2: div = <div>22</div>; break;
  }

  console.log(11);

  return <div>{div}</div>
}

function hh(){
  let div = null;
  $switch(a).case(1, ()=>{
    div = <div>11</div>;
  }).case(2)
  switch(a){
    case 1: div = div('11'); break;
    case 2: div = div('11'); break;
  }

  console.log(11);

  return <div></div>
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