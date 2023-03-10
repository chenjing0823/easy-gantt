<template>
  <div id="app">
    <el-button @click="show = 1">甘特图1</el-button>
    <el-button @click="show = 2">甘特图2</el-button>
    <el-button @click="show = 3">demo3</el-button>
    <gantt1 v-if="show === 1"></gantt1>
    <gantt2 v-else-if="show === 2"></gantt2>
    <HelloWorld v-else-if="show === 3"></HelloWorld>
  </div>
</template>

<script>
import gantt1 from './components/gantt1.vue'
import gantt2 from './components/gantt2.vue'

import HelloWorld from './components/HelloWorld.vue'
export default {
  components: {
    gantt1,
    gantt2,
    HelloWorld
  },
  data () {
    return {
      show: 3
    }
  }
}
</script>
