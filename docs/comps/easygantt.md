# Easy Gantt 使用

> 本文档使用vuepress搭建，其自动生成的样式，与部分element样式冲突，可能会出现一些滑动异常bug，不影响正常使用

## 基本用法
+ 传参 ``` ganttHead ```, 用于渲染甘特图的时间
+ 传参 ``` ganttData ```, 用于渲染甘特图的数据

> 数据说明：
<br />
``` ganttData ``` 内的 ``` data ``` 中,
<br />
``` start ```：开始时间刻度<br /> ``` end ``` ：结束时间刻度<br />```name```：展示名称<br />```state```: 可不传，若传```'success'``` 为成功状态(绿色)
<br />



::: demo
```html
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
:::


## moveToAdd
> ``` moveToAdd ```能否手动滑动图表添加数据，默认``` true ```

::: demo
```html
<template>
  <div id="app">
    <easy-gantt
      :moveToAdd="moveToAdd"
      :ganttHead="ganttHead"
      :ganttData="ganttData"
      ></easy-gantt>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      moveToAdd: false,
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
            { id: '1-1',  start: 'wen', end: 'wen', name: '12:00-13:00 工单名称1' }
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
    }
  }
</script>

```
:::

## props参数说明
| 参数     | 说明     | 数据类型     | 默认值     |
| -------- | -------- | -------- | -------- |
| ```limit``` | 每行数据，可展示的条数, 超出部分在更多地方展示 | ```Number``` | 2 |
| ```cellMoreTitle``` | 更多数据展示的文本 | ```String``` | "工单" |
| ```moveToAdd``` | 是否通过鼠标滑动新增数据，```true```允许，```false不允许``` | ```Boolean``` | ```true``` |
| ```usePersonalTips``` | 使用自定义添加交互，不使用默认弹窗，```true```不使用默认弹窗，```false```使用默认弹窗 | ```Boolean``` | ```false``` |
| ```ganttHead``` | 用于渲染甘特图的时间 | ```Array``` | [] |
| ```ganttData``` | 用于渲染甘特图的数据 | ```Array``` | [] |

## 事件说明

| 事件名称     | 说明     | 返回数据     |
| -------- | -------- | -------- |
| ```itemClick``` | 行数据中，具体条目点击事件 | 条目对象 |
| ```seletcData``` | 鼠标滑动选中的区间 | 开始时间节点 和 结束时间节点 |


## 动手试试
在线demo，动手试试。
 [codesanbox](https://codesandbox.io/s/easygantt-demo-8vl48r?file=/src/App.vue)
