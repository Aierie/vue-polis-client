# vue-polis-client
To run this, install dependencies, update `conversation_id` and `xid`(if you want) in `src/polisVariables.js`, and then `npm run serve`. You can use any other data attributes you would otherwise use for the polis embed as well.

## About the component
Component currently lives in `src/components/Polis.vue`. It is adapted from the [polis embed](https://pol.is/embed.js) for Vue so that it can interact better with Vue's reactivity and provide more room for behavior / ui customization.

You can listen for polis events that are sent via `window.postMessage` (vote, write, doneVoting, init) on the component by using the [v-on directive](https://vuejs.org/v2/guide/events.html). As there is no good way to do resizing with current props, there is no listener for the `resize` event exposed at the moment.

Supply config to the component - for each [data attribute](https://roamresearch.com/#/app/polis-methods/page/urQE1Ik_L) you would place on the embed div, just use the part after `data-`. so to supply `conversation_id`, you would do `:conversation_id="yourConversationId"`.

You'll need to supply either `conversation_id` or both `site_id` and `page_id`, or the component will throw an error.

Watch out when changing props passed to this component, any changes will cause the iframe to reload. Might change this in the near future.

## Examples, can try replacing the current App.vue contents with this.
Basic usage with conversation_id
```
<template>
  <Polis :conversation_id="conversation_id"/>
</template>

<script>
import Polis from "./components/Polis";
export default {
  components: {
    Polis
  },
  data(){
    return {
      conversation_id: "some_conversation_id"
    }
  }
}
</script>
```

conversation_id + xid
```
<template>
  <Polis :conversation_id="conversation_id" :xid="xid"/>
</template>

<script>
import Polis from "./components/Polis";
export default {
  components: {
    Polis
  },
  data(){
    return {
      conversation_id: "some_conversation_id",
      xid: "some_xid"
    }
  }
}
</script>
```


Adding an event listener for a vote
```
<template>
  You've voted on {{ votes }} comments this session.
  <Polis :conversation_id="conversation_id" @vote="votes += 1"/>
</template>

<script>
import Polis from "./components/Polis";
export default {
  components: {
    Polis
  },
  data(){
    return {
      votes: 0
    }
  }
}
</script>
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
