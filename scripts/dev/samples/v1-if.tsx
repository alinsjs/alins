/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:07:24
 * @Description: Coding something
 */
let React: any, $: any ,span: any,_jsx: any, react: any;

function hh(){
  let dom = null;
  let a = 1;
  a = 0;

  if(window.aaa){
    return <div>{dom}</div>;
  }
  if(a === 1){
    return <div>{111}</div>;
  }else if(a === 2){
    if(a > 4){
      dom = <div>{222}</div>;
    }else if(a === 3){
      dom = <div>{3}</div>;
    }else{
      return <div>{333}</div>;
    }
    return <div></div>
  }

  console.log(a);
  return <div>{dom}</div>
}

const domHolder = ()=>{};

function hh(){
  let h = domHolder();
  let dom = h.dom(null);
  let a = 1;
  a = 0;

  if(window.aaa){
    return h. (<div>{a}</div>);
  }

  const data = h.if(()=>a.value === 1, ()=>{
    return <div>{111}</div>;
  }).elif(a === 2, ()=>{
    const data = h.if((()=>a.value > 4), ()=>{

      dom.update(()=><div>{222}</div>, 1);
    }).elif(()=>a.value===3, ()=>{
      dom.update(()=><div>{3}</div>, 2);
    }).else(()=>{
      return <div>{111}</div>;
    }).end();
    if(data) return data;

    return <div></div>
  })
  if(data) return data;
  return h.default(()=><div>{dom}</div>);
}

hh() // => dom

import hh from 'xxx';

// <hh></hh> => dom(hh, {})

<div>
  <hh></hh>
  {
    (()=>{

    })()
  }
</div>


function hh(){
  let h = domHolder();
  let dom = h.dom(null);
  switch(a){
    case 1: dom = <div>{111}</div>;
    case 2: dom = <div>{111}</div>;break;
    case 3: 
    case 4: return <div>{111}</div>;break;
    default: break;
  }
  return <div>{333}</div>
}
function hh(){
  let h = domHolder();
  let dom = h.dom(null);

  switch(a){
    case 1: dom = <div>{111}</div>;
    case 2: dom = <div>{111}</div>;break;
    case 3: 
    case 4: return <div>{111}</div>;break;
    default: break;
  }
  return <div>{333}</div>
}
function hh(){
  let div = null;

  const data = h.switch(a)
    .case(1, () => { dom.update(<div>{111}</div>);}, false)
    .case(2, () => {dom.update(<div>{111}</div>);}, )
    .case(3, null, false)
    .case(4, ()=>{return <div>{111}</div>});
    .default(()=>{
      return h.update(<div>{3333}</div>)
    })
  if(data) return data;

  return h.default(null);
}

function hh(){
  return <div>{333}</div>
}

function hh(){
  let h = domHolder();
  let dom = h.dom(null);

  dom.update(<div></div>);

  return h.update(<div>{dom}</div>);
}


function hh(){
  let list = [];
  let obj = [];
  let children = [];

  for(let i of list){
    if(i === 3) return <div>{i}</div>
    children.push(<div>{i}</div>)
  }
  for(let [index, item] of list.entries()){
    children.push(<div>{i}</div>)
  }
  // for(let k in obj){
  //   const item = obj[k];
  //   children.push(<div>{k}{item}</div>)
  // }
  for(let i=0;i<list.length;i++) {
    children.push(<div>{i}</div>)
  }
  const cc = list.map(item=>{
    return <div>{i}</div>
  })



  return <div>{children}</div>
}


function hh(){
  let h = domHolder();
  let list = [];
  let children = h.dom([]);

  if(h.for(list, (item, index)=>{
    const data = h.if(()=>i.value === 3, ()=>{
      return h.update(<div>{111}</div>);
    })
    if(data) return data
    children.push(<div>{i}</div>)
  })) return h.generate();

  // if(h.for(list, (key)=>{
  //     const item = obj[k];
  //     children.push(<div>{i}</div>)
  // }))

  // if(h.for())
  // for(let i=0;i<list.length;i++) {
  //   children.push(<div>{i}</div>)
  // }


  const cc = list.map(item=>{
    return <div>{i}</div>
  })

  if(data) return data

  return <div>{children}</div>
}