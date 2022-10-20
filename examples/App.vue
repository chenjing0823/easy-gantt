<template>
  <div id="app">
    <EasyGantt
      ref="easygantt"
      :ganttHead="ganttHead"
      :ganttData="ganttData"
      @seletcData="seletcData"
      @itemClick="itemClick"
      ></EasyGantt>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data () {
    return {
      ganttHead: [
        { prop: 'wen', label: '07-13 周三' },
        { prop: 'thu', label: '07-14 周四' },
        { prop: 'fri', label: '07-15 周五' },
        { prop: 'sat', label: '07-16 周六' },
        { prop: 'sun', label: '07-17 周天' },
        { prop: 'mon', label: '07-18 周一' },
        { prop: 'tue', label: '07-19 周二' }
      ],
      ganttData: [
        {
          id: '1',
          title: '陈靖',
          order: 1,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称1' },
            { start: 'fri', end: 'sat', name: '12:00-13:00 工单名称2' },
            { start: 'fri', end: 'fri', name: '12:00-13:00 工单名称3' },
            { start: 'fri', end: 'sat', name: '12:00-13:00 工单名称4' },
            { start: 'sat', end: 'sat', name: '12:00-13:00 工单名称5' },
            { start: 'sun', end: 'sun', name: '12:00-13:00 工单名称6' }
          ]
        },
        {
          id: '2',
          title: '余宇豪',
          order: 2,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称7' },
            { start: 'wen', end: 'thu', name: '12:00-13:00 工单名称8' }
          ]
        },
        {
          id: '3',
          title: '刘娟娟',
          order: 3,
          data: [
            { start: 'thu', end: 'thu', name: '12:00-13:00 工单名称9' }
          ]
        }
      ]
    }
  },
  methods: {
    seletcData (data) {
      console.log(data)
      const { rowid, start, end } = data

      const rowindex = this.ganttData.findIndex(res => res.id === rowid)
      // 添加数据
      this.ganttData[rowindex].data.push(
        { start: start, end: end, name: '12:00-13:00 手动添加' })
      this.$refs.easygantt.renderGantBlock() // 触发渲染
    },
    itemClick (item) {
      console.log(item)
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
