<!--
 * @Author: tackchen
 * @Date: 2022-10-13 13:06:17
 * @Description: Coding something
-->
<template>
  <div id="app">
    <button @click="update">update</button>
    <button @click="clear">clear</button>
    <div v-for="(item, index) in array" :key="index">{{item.a}}</div>
  </div>
</template>

<script>

const array = [];
for(let i=0;i<30000;i++){
  array.push({
    a: Math.random().toString()
  })
}
export default {
  name: 'App',
  data(){
    return {
      array
    }
  },
  beforeCreate() {
    console.log(window.app.childElementCount);
    window.addEventListener('click', () => {
        console.log('click');
    });
    console.time('mounted');
    console.time('created');
    setTimeout(()=>{
      console.log('setTimeout');
      console.timeLog('mounted');
    }, 0)
    this.$nextTick(()=>{
      console.log('nextTick');
      console.timeLog('mounted');
    })
    window.addEventListener('load', ()=>{
      console.log('load');
      console.timeLog('mounted');
    })
    window.addEventListener('DOMContentLoaded', ()=>{
      console.log('DOMContentLoaded');
      console.timeLog('mounted');
    })
  },
  mounted(){
    console.log('mounted');
    console.timeLog('mounted');
    console.log(window.app.childElementCount);
    console.log(window.app.children[window.app.children.length-1])
    console.log(window.app.children[window.app.children.length-1].innerText)

  },
  created(){
    console.log('created');
    console.timeEnd('created');
    window.v = this;
  },
  updated: function () {
      console.timeEnd('updated');
  },
  methods: {
    update(){
      console.log('update');
      console.time('updated');
      this.array.forEach((item)=>{
        item.a = item.a + 'xxxxx'
      })
      console.timeEnd('updated');
    },
    clear(){
      document.body.innerHTML = ''
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
