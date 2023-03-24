<template>
  <div class="gantt2" style="display: flex;">
    <!-- <div>asdas</div> -->
    <EasyGanttV2
      ref="easygantt"
      :list="list"
      :line="line"
      :dataList="dataList"></EasyGanttV2>
  </div>
</template>

<script>
import mockdata from './mockdata'
export default {
  name: 'gantt2',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
  },

  data () {
    return {
      line: [
        { id: 1, sourceid: 11, targetid: 12 }
      ],
      dataList: [
        {
          name: '项目启动阶段',
          ower: '',
          per: 30,
          type: '3',
          planTime: [],
          stoneTime: '',
          startTime: 1677945600000,
          endTime: 1678982400000,
          id: 1,
          hasChildren: true
        },
        {
          name: '项目阶段2',
          ower: '',
          per: 100,
          type: '3',
          planTime: [],
          stoneTime: 1678723200000,
          startTime: 1678723200000,
          endTime: 1678723200000,
          id: 2,
          hasChildren: true
        },

        {
          name: '项目启动阶段',
          ower: '',
          per: 30,
          type: '3',
          planTime: [],
          stoneTime: '',
          startTime: 1677945600000,
          endTime: 1678982400000,
          id: 3,
          hasChildren: true
        }
      ],
      list: []
    }
  },
  mounted () {
    this.getGanttData()
  },

  methods: {
    // 获取任务接口 id父id 当前任务第几层
    mockTaskGet (id, level) {
      return new Promise((resolve, reject) => {
        const data = mockdata[id].map((data) => {
          return {
            ...data,
            level: level,
            parentId: id
          }
        })
        setTimeout(() => {
          resolve(data)
        }, 300)
      })
    },
    // 需要请求获取任务的接口数 一起
    async requestData (dataList, level) {
      const arr = []
      dataList.forEach(async (item, index) => {
        if (item.hasChildren) {
          const request = this.mockTaskGet(item.id, level)
          arr.push(request)
        } else {
          arr.push(null)
        }
      })
      const task = await Promise.all(arr)
      return task
    },
    async getGanttData () {
      const nowLevelData = async (dataList, level) => {
        const taskData = await this.requestData(dataList, level)

        const len = taskData.length
        let childindex = 0
        while (childindex < len) {
          const item = taskData[childindex]
          if (item && item.length) {
            const data = await nowLevelData(item, level + 1)
            console.log('子')
            await this.dataListFormat(item, data)
          }
          childindex++
        }
        return taskData
      }
      // await nowLevelData(this.dataList, 1)
      console.time('request')
      const data = await nowLevelData(this.dataList, 1)
      await this.dataListFormat(this.dataList, data)
      console.timeEnd('request')
      console.log('父')
      console.log(this.dataList)
      this.$refs.easygantt.dataFormat()
    },
    /**
     * @description: 将子任务 塞入对应父级
     * @param {Array} 父级数组
     * @param {taskData} 所有父子的子任务数组
     */
    dataListFormat (dataList, taskData) {
      const len = taskData.length
      return new Promise(resolve => {
        let index = 0
        while (index < len) {
          taskData[index] && this.$set(dataList[index], 'children', taskData[index])
          index++
        }
        resolve()
      })
    }
  }
}
</script>
<style lang="stylus">
.gantt2 {
  height: 700px;
  width: 100%;
}
</style>
