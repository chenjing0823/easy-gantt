<template>
  <div class="easy-gantt-v2">
    <el-button style="position: fixed; top: 0; right: 0" @click="gotoday">今天</el-button>
    <el-button style="position: fixed; top: 0; right: 100px" @click="dialogFormVisible = true"
      >新建数据</el-button
    >
    <el-select v-model="currentDaySize.value" @change="handleSetDaySize" placeholder="请选择" style="position: fixed; top: 0; right: 200px">
      <el-option
        v-for="item in currentDaySizeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="gantt-left">
      <div class="search">
        <el-input v-model="search" placeholder="请输入内容" size="mini"> </el-input>
      </div>

      <left-card
        :list="list"
        :style="{ width: leftWidth + 'px' }"
        @handlerNewTask="handlerNewTask"
      ></left-card>
    </div>
    <div class="gantt-right">
      <gnatt-head
        :all-days="allDays"
        :isHover="isHover"
        :current-day-size="currentDaySize"
        :current-line-day="currentLineDay"
      >
      </gnatt-head>
      <gantt-body
        ref="ganttbody"
        :isHover.sync="isHover"
        :current-day-size="currentDaySize"
        :current-line-day="currentLineDay"
        :left-width="leftWidth"
        :list="list"
        :line="line"
        @currentLineDayInit="currentLineDayInit"
        @handleCurrentLineDay="handleCurrentLineDay"
        @handleTimeChange="handleTimeChange"
      >
      </gantt-body>
    </div>
    <gantt-add
      :dialogFormVisible.sync="dialogFormVisible"
      @handlerNew="handlerNew" />
  </div>
</template>

<script>
import LeftCard from './components/left-card.vue'
import GnattHead from './components/gantt-head.vue'
import GanttBody from './components/gantt-body.vue'
import GanttAdd from './components/gantt-add.vue'

import ganttTool from './components/gantt-tool.js'

export default {
  name: 'EasyGanttV2',

  components: {
    LeftCard,
    GnattHead,
    GanttBody,
    GanttAdd
  },

  filters: {},

  mixins: [],
  props: {
    leftWidth: {
      type: Number,
      default: 240
    },
    list: {
      type: Array,
      default: () => []
    },
    line: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      isHover: false,
      // 当前项是否是子集
      isChildren: false,
      search: '',
      // 近三年的所有年月日
      allDays: [],
      // 月数
      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      // 当前的时间大小
      currentDaySize: {
        label: '天',
        value: 40
      },
      currentDaySizeOptions: [
        {
          label: '天',
          value: 40
        },
        {
          label: '周',
          value: 24
        },
        {
          label: '月',
          value: 12
        }
      ],
      // 当前hover的项目起止时间
      currentLineDay: {
        start: 0,
        end: 0
      },
      dialogFormVisible: false,
      currentListIndex: '',
      currentRow: null,
      dataListNew: []
    }
  },

  computed: {
    // 当前年份
    currentYear () {
      return new Date().getFullYear()
    },
    // 当前月份
    currentMonth () {
      return new Date().getMonth() + 1
    },
    // 当前日
    currentDay () {
      return new Date().getDate()
    }
  },

  watch: {
    'currentDaySize.value' (newValue, oldValue) {
      this.list.forEach(item => {
        item.left = (item.left / oldValue) * newValue
        item.widthMe = item.widthChild =
          (item.widthMe / oldValue) * newValue
        if (item.children && item.children.length > 0) {
          item.children.forEach(k => {
            k.left = (k.left / oldValue) * newValue
            k.widthMe = k.widthChild =
              (k.widthMe / oldValue) * newValue
          })
        }
      })
    }
  },

  mounted () {
    this.getDay()
    this.dataFormat()
  },

  methods: {
    /**
     * @description: 数据格式化，拿到每个甘特图节点的位置信息
     */
    dataFormat () {
      const getAllList = (dataList, isChildren = false, currentListIndex = '') => {
        let arr = []
        dataList.forEach((item, index) => {
          item.isChildren = isChildren // 是否子任务
          item.currentListIndex = currentListIndex // 子任务所在的父index
          if (!item.children || item.children.length < 1) {
            arr.push(item)
          } else if (item.children && item.children.length >= 1) {
            const _item = JSON.parse(JSON.stringify(item))
            delete _item.children
            arr.push(_item)
            arr = arr.concat(getAllList(item.children, true, index)) // children数组，是子任务，父节点index
          }
        })
        return arr
      }
      getAllList(this.dataList).forEach(data => {
        this.pushData(data, true)
      })
    },
    getDay () {
      this.getAllDate()
    },
    getAllDate () {
      let obj = {}
      const arr = [this.currentYear - 1, this.currentYear, this.currentYear + 1]
      arr.forEach((item) => {
        obj.year = item
        obj.days = ganttTool.isLeapYear(item) ? 365 : 366
        this.allDays.push(obj)
        obj = {}
      })

      this.checkDate()
    },
    /**
     * @description: 天数距离左侧距离
     */
    dayWidthFormat () {
      let arr = []
      let days = []
      this.allDays.forEach((item) => {
        arr = arr.concat(item.month)
      })
      arr.forEach((item) => {
        for (const j in item) {
          days = days.concat(item[j])
        }
      })
      days.forEach((item, index) => {
        item.width = (index + 1) * this.currentDaySize.value
      })
    },
    /**
     * @description: 切换时间轴
     */
    handleSetDaySize () {
      this.dayWidthFormat()
      this.$nextTick(() => {
        this.gotoday()
      })
    },
    /**
     * @description: 根据年份天数创建月份及月份天数数组
     */
    checkDate () {
      this.allDays = this.allDays.map((item) => {
        item.month = this.handleMonthDay(item.days, item.year)
        return {
          ...item
        }
      })
      // console.log(this.allDays);
      const dayFilter = (arr, target, key) => {
        return arr.find((element) => {
          return element[key] === target
        })
      }
      const todayYear = dayFilter(this.allDays, this.currentYear, 'year')
      const today = dayFilter(todayYear.month[0][this.currentMonth], this.currentDay, 'date')
      // const todayYear = this.allDays.find(element => {
      //   return element.year === this.currentYear
      // })
      // const today = todayYear.month[0][this.currentMonth].find(element => {
      //   return element.date === this.currentDay
      // })
      today.today = true
      this.dayWidthFormat()
    },
    /**
     * @description: 处理每月等天数数组
     * @param  {Number} days
     * @param  {Number} year
     */
    handleMonthDay (days, year) {
      const arr = []
      const obj = {}
      this.monthArr.forEach((item) => {
        obj[item] = ganttTool.checkMonthDays(item, days)
      })
      arr.push(obj)
      const allMonth = arr[0]
      for (const item in allMonth) {
        allMonth[item] = ganttTool.addNum(allMonth[item], item, year)
      }
      return arr
    },
    /**
     * @description: 回到今天
     */
    gotoday () {
      const day = 1000 * 60 * 60 * 24
      const ganttLeft =
        Math.round(window.innerWidth / this.currentDaySize.value / 2) * this.currentDaySize.value -
        this.leftWidth
      const width =
        (Math.floor(
          new Date(`${this.currentYear}/${this.currentMonth}/${this.currentDay}`).getTime() -
            new Date(`${this.currentYear - 1}/01/01`).getTime()
        ) /
          day) *
          this.currentDaySize.value -
        ganttLeft
      document.querySelector('.gantt-right').scrollTo({
        top: 0,
        left: width,
        behavior: 'smooth'
      })
    },
    handleCurrentLineDay (data) {
      this.currentLineDay = data
    },
    currentLineDayInit (data) {
      this.currentLineDay = data
    },
    /**
     * @description: 移动任务时间，或者伸缩任务，重新获取开始时间和结束时间
     * @param: {Object} 滑动任务快的数据体
     */
    handleTimeChange (data) {
      if (!data.parentId) {
        // 里程碑节点
        const stone = this.list.findIndex((stone) => {
          return stone.id === data.id
        })
        this.list[stone].startTime = data.startTime
        this.list[stone].endTime = data.endTime
        return
      }
      const first = this.list.findIndex((first) => {
        return first.id === data.parentId
      })
      const second = this.list[first].children.findIndex((second) => {
        return second.id === data.id
      })
      this.list[first].children[second].startTime = data.startTime
      this.list[first].children[second].endTime = data.endTime
    },
    /**
     * @description: 根据时间计算距离
     * @param: {Number} startTime 开始时间戳 毫秒
     * @param: {Number} endTime 结束时间戳 毫秒
     */
    computedTimeWidth (startTime, endTime) {
      const left =
        (Math.floor(startTime - new Date(`${this.currentYear - 1}/01/01`).getTime()) /
          (1000 * 60 * 60 * 24)) *
        this.currentDaySize.value
      const width =
        (Math.floor(endTime - startTime) / (1000 * 60 * 60 * 24)) * this.currentDaySize.value +
        this.currentDaySize.value
      if (!endTime) {
        return left
      } else {
        return width
      }
    },
    /**
     * @description: 新增提交数据
     * @param: {Object} 表格内容
     */
    handlerNew (val) {
      const obj = Object.assign({}, val)
      const startTime = obj.planTime.length > 0 ? obj.planTime[0] : obj.stoneTime
      const endTime = obj.planTime.length > 0 ? obj.planTime[1] : obj.stoneTime
      this.$set(obj, 'startTime', startTime)
      this.$set(obj, 'endTime', endTime)
      this.pushData(obj)
      if (obj.type !== '3') {
        this.handlerRowClick(obj)
      }
      this.currentListIndex = ''
      this.isChildren = false
      this.dialogFormVisible = false
    },
    /**
     * @description: 插入数据
     */
    pushData (obj, isInit = false) {
      const isChildren = this.isChildren || obj.isChildren
      const currentListIndex = this.currentListIndex || obj.currentListIndex
      const index = this.list.length
      if (obj.type !== 3) {
        this.$set(obj, 'left', this.computedTimeWidth(obj.startTime))
        this.$set(obj, 'widthMe', this.computedTimeWidth(obj.startTime, obj.endTime))
        this.$set(obj, 'widthChild', this.computedTimeWidth(obj.startTime, obj.endTime))
        let top
        if (index === 0) {
          top = 6
        } else {
          const children = this.list[index - 1].children
          if (children && children.length > 0) {
            top = children[children.length - 1].top + 40
          } else {
            top = this.list[index - 1].top + 40
          }
        }
        this.$set(obj, 'top', top)
      }
      if (obj.type === 2) {
        obj.per = 100
      } else if (obj.type === 3) {
        obj.per = 0
        obj.id = obj.id || new Date().getTime()
        this.$set(obj, 'expand', true)
        let childrenTop
        if (index === 0) {
          childrenTop = 8 // 项目top 8 刚好
        } else {
          const children = this.list[index - 1].children
          if (children && children.length > 0) {
            childrenTop = children[children.length - 1].top + 40
          } else {
            childrenTop = this.list[index - 1].top + 40
          }
        }
        this.$set(obj, 'top', childrenTop)
      }
      obj.id = obj.id || new Date().getTime()
      this.$set(obj, 'isShow', true)
      if (isChildren && currentListIndex !== '') {
        const row = this.list[parseInt(currentListIndex)]
        row.children = row.children ? row.children : []
        this.$set(row, 'expand', true) // 展开有操作 需要响应
        const cindex = row.children.length
        obj.top = 40 + cindex * 40 + row.top
        obj.parentId = row.id
        row.children.push(obj)
        row.children.forEach((item) => {
          item.isShow = true
        })
        if (!isInit) {
          this.setGroupWidth(row.id)
          this.setGroupPer(row.id)
          this.resetTop(currentListIndex)
        }
        this.$set(this.list, parseInt(currentListIndex), row)
      } else {
        this.$set(this.list, index, obj)
        // this.list.push(obj)
      }
    },
    /**
     * @description: 根据id设置group的宽度
     * @param: {Number} id
     */
    setGroupWidth (id, lists) {
      let parent
      if (lists) {
        parent = lists.find((item) => {
          return item.id === id
        })
      } else {
        parent = this.list.find((item) => {
          return item.id === id
        })
      }
      const left = Math.min.apply(
        Math,
        parent.children.map((o) => {
          return o.left
        })
      )
      const arr = []
      parent.children.forEach((item) => {
        arr.push(item.left + item.widthMe)
      })
      const width = Math.max.apply(Math, arr)
      const widthMe = width - left
      parent.widthMe = parent.widthChild = widthMe
      parent.left = left
      // return parent;
    },
    /**
     * @description: 设置分组百分比
     * @param: {Number} id
     */
    setGroupPer (id, lists) {
      let z
      if (lists) {
        z = lists.find((o) => {
          return o.id === id
        })
      } else {
        z = this.list.find((o) => {
          return o.id === id
        })
      }
      let count = 0
      const length = z.children.length
      z.children.forEach((item) => {
        count = count + (item.per / 100) * (1 / length)
      })
      z.per = Math.round(count * 100)
    },
    // 修改后续高度
    resetTop (zindex, reduce, isexpand) {
      // console.log(zindex, reduce, isexpand);
      const num = reduce ? -40 : 40
      if (!reduce && !isexpand) {
        // console.log(2);
        this.list.forEach((item, index) => {
          if (index > zindex) {
            item.top = item.top + 40
            if (item.children && item.children.length > 0) {
              item.children.forEach((k, i) => {
                k.top = item.top + 40 * i + 40
              })
            }
          }
        })
      } else {
        // console.log(1);
        this.list.forEach((item, index) => {
          if (index > zindex) {
            item.top = item.top + num * this.list[zindex].children.length
            if (item.children && item.children.length > 0) {
              item.children.forEach((k, i) => {
                k.top = item.top + 40 * i + 40
              })
            }
          }
        })
      }
    },
    handlerNewTask (row) {
      this.currentListIndex = this.list.findIndex((item) => {
        return item.id === row.id
      })
      this.dialogFormVisible = true
      this.isChildren = true
    },
    handlerRowClick (row) {
      document.querySelector('.gantt-right').scrollTo({
        top: 0,
        left: row.left - 100,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.easy-gantt-v2 {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden
  // background-color: #F4F4F4;
}
.gantt-left {
  flex: none;
  .search {
    height: 28px;
    background-color: #ffffff;
    padding: 10px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #EBEEF5;
  }
}
.gantt-right {
  flex: 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 100%
  overflow-x: scroll;
}
</style>
