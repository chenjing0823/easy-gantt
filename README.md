
<img src="https://github.com/chenjing0823/easy-gantt/blob/master/docs/.vuepress/public/logo.png" alt="Easy Gantt">

# homepage
组件具体使用说明：[组件使用说明](http://saiyanjing.top/)



# 使用
```
npm i easygantt
```

``` main.js ``` 内引入依赖
```js
import EasyGantt from 'easygantt'
import 'easygantt/dist/easyGantt.css'


Vue.use(EasyGantt)
```

### 默认用法
+ 传参 ``` ganttHead ```, 用于渲染甘特图的时间
+ 传参 ``` ganttData ```, 用于渲染甘特图的数据

> 数据说明：
> <br />
> ``` ganttData ``` 内的 ``` data ``` 中,
> <br />
> ``` start ```表示开始时间刻度 ``` end ``` 表示结束时间刻度
> <br />
> 操作说明：
> ``` this.$refs.easygantt.renderGantBlock() ```用于更新渲染甘特图

``` vue
<template>
  <div id="app">
    <easy-gantt
      ref="easygantt"
      :sort="sort"
      :ganttHead="ganttHead"
      :ganttData="ganttData"
      @seletcData="seletcData"
      ></easy-gantt>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sort: {
          row: "时间",
          column: "成员"
        },
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
            title: '张三',
            order: 1,
            data: [
              { id: '1-1', start: 'wen', end: 'wen', name: '周三 拜访我大哥地方', state: 'success' },
              { id: '1-2',  start: 'fri', end: 'sat', name: '周五-周六 隐藏三条以上数据1', state: 'success' },
              { id: '1-3',  start: 'fri', end: 'fri', name: '周五 隐藏三条以上数据2' },
              { id: '1-4',  start: 'fri', end: 'sat', name: '周五-周六 隐藏三3，通过limit属性控制，默认为2' }
            ]
          },
          {
            id: '2',
            title: '李四',
            order: 2,
            data: [
              { id: '2-1',  start: 'wen', end: 'wen', name: '12:00-13:00 工单名称7' },
            ]
          },
          {
            id: '3',
            title: '王五',
            order: 3,
            data: [
              { id: '3-1',  start: 'thu', end: 'thu', name: '12:00-13:00 工单名称9' }
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
