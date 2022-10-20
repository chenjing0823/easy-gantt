# east-gantt

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

# homepage
组件具体使用说明：[组件使用说明](https://chenjing0823.github.io/comps/#npm%E5%AE%89%E8%A3%85)

### Compiles and minifies for production
```
npm run build
```

# 使用
```
npm i easy-gantt
```

``` main.js ``` 内引入依赖
```js
import EasyGantt from 'easy-gantt'
import 'easy-gantt/lib/easyGantt.css'


Vue.use(EasyGantt)
```

### 默认用法
+ 传参 ``` ganttHead ```, 用于渲染甘特图的时间
+ 传参 ``` ganttData ```, 用于渲染甘特图的数据

> 数据说明：
<br />
``` ganttData ``` 内的 ``` data ``` 中,
<br />
``` start ```表示开始时间刻度 ``` end ``` 表示结束时间刻度
<br />
操作说明：
``` this.$refs.easygantt.renderGantBlock() ```用于更新渲染甘特图

``` vue
<template>
  <div id="app">
    <EasyGantt
      ref="easygantt"
      :ganttHead="ganttHead"
      :ganttData="ganttData"
      @seletcData="seletcData"
      ></EasyGantt>
  </div>
</template>

<script>

export default {
  data () {
    return {
      limit: 2, // 不传也可以 默认超出2 显示更多
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
    }
  }
}
</script>


```