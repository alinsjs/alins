/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-27 20:07:24
 * @Description: Coding something
 */
let React: any, $: any ,span: any,_jsx: any, react: any;

function dynamic(){

  let a = 1;
  if(a === 1){
    const s = Date.now();
    a = 2;
    return <div>{s}</div>
  }
  return <div>{a}</div>
}

function dynamic(){
  const c = createContext();

  let a = c.$(1);
  const dom = c.if(()=>(a.value === 1), ()=>{
    const s = Date.now();
    a.value = 2;
    return <div>{s}</div>
  }).end();
  if(dom) return dom;
  
  return <div>{a}</div>
}

function App(){
  return <div>
    <dynamic></dynamic>
  </div>
}


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
      const data = await aa();
      let v = '';
      if(data.success){
        v = data.info;
      }
      const s = Date.now();
      return <div>{111}{v}{s}</div>;
    }
    return <div></div>
  }

  console.log(a);
  return <div>{dom}</div>
}

const createContext = ()=>{};

async function hh(){
  const data = await aa();
  const data2 = Date.now() + 1000;
  let v = '';
  if(data === 1){
    v = data;
    return; //  => return null;
  }else{
    v = data2;
  }
  
  return <div>{v}</div>
}

async function hh(){
  let v = '';
  let data;
  if(v === 1){
    data = await aa();
  }
  return <div>{data}</div>
}
async function hh(){
  let v = '';
  let data = react('');
  if(v === 1){
    const r = c.async(async ()=>{
      data.value = await aa();
    }, false)
  }
  return <div>{data}</div>
}
async function hh(){
  const data = await aa();
  return <div>{data}</div>
}
async function hh(){
  let c = createContext();
  const r = c.async(async ()=>{
    const data = await aa();
    return <div>{data}</div>
  }, 1)
  return r;
}

function hh(){
  let c = createContext();
  
  return c.async((async ()=>{
    const data = await aa();
    const data2 = Date.now() + 1000;
    let v = '';
    if(data === 1){
      v = data;
    }else{
      v = data2;
    }
    return <div>{v}</div>
  }))
}

function hh(){
  return <div>11</div>
}


function hh(){
  let c = createContext();
  let dom = h.dom(null);
  let a = 1;
  a = 0;

  var a = setTimeout(()=>{
    if(){
      // ...
    }
  }, 1000)

  if(window.aaa){
    return (<div>{a}</div>);
  }

  const data = c.if(()=>a.value === 1, ()=>{
    return <div>{111}</div>;
  }).elif(a === 2, ()=>{
    const data = c.if((()=>a.value > 4), ()=>{
      dom.update(()=><div>{222}</div>, 1);
    }).elif(()=>a.value===3, ()=>{
      dom.update(()=><div>{3}</div>, 2);
    }).else(async ()=>{
      return c.async(async (node)=>{
        const data = await aa();
        let v = '';
        if(data.success){
          v = data.info;
        }
        const s = Date.now();
        return <div>{111}{v}{s}</div>;
      })
    }).end();
    if(data) return data;

    return <div></div>
  })
  if(data) return data;
  return c.default(()=><div>{dom}</div>);
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
    case 4: 
      const data = new Date();
      return <div>{111}{data.toString()}</div>;break;
    default: break;
  }

  return <div>{333}</div>
}
function hh(){
  let h = domHolder();
  let div = null;

  // todo json 使用empty
  return h.switch(a, [{
    '1': ()=>{
      dom = <div>{111}</div>;
    },
    '2': ()=>{
      dom = <div>{111}</div>;
      return h.break;
    },
    '3': ()=>{},
    '4': () => {
      const data = new Date();
      return <div>{111}{data.toString()}</div>;
    },
    ['default']: ()=>{
      return h.break;
    }]).end(()=>{
    return <div>{333}</div>
  })

}

function ff(){
  let a = 1;
  let b = 2;
  let dom = null;
  if(a === 1){
    return <div>{a}</div>
  }else if(a > 2){
    switch(b){
      case 3: dom = <div>{b}</div>;break;
      default: break;
    }
  }
  a = 2;
  b = 3;
  return <div>{a}{dom}</div>
}
function ff(){
  let a = 1;
  let b = 2;
  let dom = null;
  if(a === 1){
    return <div>{a}</div>
  }else if(a > 2){
    switch(b){
      case 3: dom = <div>{b}</div>;break;
      default: break;
    }
  }
  a = 2;
  b = 3;
  return <div>{a}{dom}</div>
}

function hh(){
  return <div>{333}</div>
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


  for(let i=0,a=2;a<10;i++){
    const item = list[a];
    children.push(xxx);
  }

   


  h.for((call)=>{
    let i=0,a=2;

    while(a<list.length){
      call(i,a);
      i++
    }

  }, (i,a)=>{
    children.push(i,a);
  })


  for(let i of list){
    if(i === 3) return <div>{i}</div>
    children.push(<div>{i}</div>)
  }

  return h.for(list, )

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