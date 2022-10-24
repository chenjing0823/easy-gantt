# Easy Gantt 使用

> 本文档使用vuepress搭建，其自动生成的样式，与部分element样式冲突，可能会出现一些滑动异常bug，不影响正常使用

## 基本用法
+ 传参 ``` ganttHead ```, 用于渲染甘特图的时间
+ 传参 ``` ganttData ```, 用于渲染甘特图的数据

> 数据说明：
<br />
``` ganttData ``` 内的 ``` data ``` 中,
<br />
``` start ```表示开始时间刻度 ``` end ``` 表示结束时间刻度
<br />



::: demo
```html
<template>
  <div id="app">
    <easy-gantt
      ref="easygantt"
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
            { start: 'fri', end: 'sat', name: '12:00-13:00 工单名称4' }
          ]
        },
        {
          id: '2',
          title: '余宇豪',
          order: 2,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称7' }
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
:::


## moveToAdd
> ``` moveToAdd ```能否手动滑动图表添加数据，默认``` true ```

::: demo
```html
<template>
  <div id="app">
    <easy-gantt
      ref="easygantt"
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
          title: '陈靖',
          order: 1,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称1' }
          ]
        },
        {
          id: '2',
          title: '余宇豪',
          order: 2,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称7' },
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
    }
  }
</script>

```
:::

## 参数说明
| 参数     | 说明     | 数据类型     | 默认值     |
| -------- | -------- | -------- | -------- |
| ```limit``` | 每行数据，可展示的条数 | ```Number``` | 2 |
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
