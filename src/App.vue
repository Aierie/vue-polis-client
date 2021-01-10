<template>
  <div id="app">
    Your conversation id: <input v-model="conversation_id"/>
    Your xid: <input v-model="xid"/>
    <Polis conversation_id="conversation_id" @vote="celebrate"/>
  </div>
</template>

<script>
import Polis from './components/Polis.vue'
import polisVariables from "./polisVariables";

export default {
  name: 'App',
  components: {
    Polis
  },
  data(){
    return {
      xid: polisVariables.xid,
      conversation_id: polisVariables.conversation_id
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
