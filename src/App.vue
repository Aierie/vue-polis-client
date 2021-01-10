<template>
  <div id="app">
    Your conversation id: <input v-model="conversation_id"/>
    Your xid: <input v-model="xid"/>
    <Polis conversation_id="" :xid="xid" @vote="celebrate"/>
  </div>
</template>

<script>
import Polis from './components/Polis.vue'

export default {
  name: 'App',
  components: {
    Polis
  },
  data(){
    return {
      xid: "",
      conversation_id: ""
    }
  },
  methods: {
    celebrate(){
      alert("whoo! a vote")
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
