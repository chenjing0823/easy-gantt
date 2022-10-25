<template>
  <div id="app">
    <EasyGantt
      ref="easygantt"
      :sort="sort"
      :ganttHead="ganttHead"
      :ganttData="ganttData"
      @seletcData="seletcData"
      @itemClick="itemClick"
      ></EasyGantt>
  </div>
</template>

<script>

export default {
  data () {
    return {
      sort: {
        row: '时间',
        column: '员工'
      },
      ganttHead: [
        {
          prop: '0',
          label: '00:00'
        },
        {
          prop: '1',
          label: '01:00'
        },
        {
          prop: '2',
          label: '02:00'
        },
        {
          prop: '3',
          label: '03:00'
        },
        {
          prop: '4',
          label: '04:00'
        },
        {
          prop: '5',
          label: '05:00'
        },
        {
          prop: '6',
          label: '06:00'
        },
        {
          prop: '7',
          label: '07:00'
        },
        {
          prop: '8',
          label: '08:00'
        },
        {
          prop: '9',
          label: '09:00'
        },
        {
          prop: '10',
          label: '10:00'
        },
        {
          prop: '11',
          label: '11:00'
        },
        {
          prop: '12',
          label: '12:00'
        },
        {
          prop: '13',
          label: '13:00'
        },
        {
          prop: '14',
          label: '14:00'
        },
        {
          prop: '15',
          label: '15:00'
        },
        {
          prop: '16',
          label: '16:00'
        },
        {
          prop: '17',
          label: '17:00'
        },
        {
          prop: '18',
          label: '18:00'
        },
        {
          prop: '19',
          label: '19:00'
        },
        {
          prop: '20',
          label: '20:00'
        },
        {
          prop: '21',
          label: '21:00'
        },
        {
          prop: '22',
          label: '22:00'
        },
        {
          prop: '23',
          label: '23:00'
        }
      ],
      ganttData: [
        {
          id: 8983,
          title: '老八',
          order: 0,
          data: [
            {
              start: '0',
              end: '2',
              name: '工单名称 00:00 - 3:00'
            },
            {
              start: '0',
              end: '2',
              name: '00:00 - 3:00 工单名称2',
              state: 'success'
            },
            {
              start: '0',
              end: '2',
              name: '00:00 - 3:00 工单名称3'
            },
            {
              start: '2',
              end: '4',
              name: '2:00 - 5:00 工单名称4'
            }
          ]
        },
        {
          id: 8982,
          title: '老六',
          order: 1,
          data: [
            {
              start: '0',
              end: '2',
              name: '00:00 - 3:00 工单名称3'
            },
            {
              start: '2',
              end: '4',
              name: '2:00 - 5:00 工单名称4'
            }
          ]
        }
      ]
    }
  },
  methods: {
    seletcData (data) {
      console.log(data)
      const { rowid, start, end } = data

      const rowindex = this.ganttData.findIndex(res => +res.id === +rowid)
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
