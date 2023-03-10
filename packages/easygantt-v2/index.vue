<template>
  <div class="easy-gantt-v2">
    <el-button style="position: fixed; top: 0; right: 0" @click="gotoday">今天</el-button>
    <el-button style="position: fixed; top: 0; right: 200px" @click="dialogFormVisible = true"
      >新建数据</el-button
    >
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
        :current-day-size="currentDaySize"
        :current-line-day="currentLineDay"
      >
      </gnatt-head>
      <gantt-body
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
      @handlerNew="submit" />
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
    }
  },

  data () {
    return {
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
      // 当前hover的项目起止时间
      currentLineDay: {
        start: 0,
        end: 0
      },
      dialogFormVisible: false,
      currentListIndex: '',
      currentRow: null
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

  watch: {},

  mounted () {
    this.getDay()
  },

  methods: {
    getDay () {
      this.getAllDate()
    },
    // 判断是否为闰年
    /**
     * @param  {Number} year 传入年份
     */
    isLeapYear (year) {
      if (year % 4 > 0) {
        return true
      }
      return false
    },
    getAllDate () {
      let obj = {}
      const arr = [this.currentYear - 1, this.currentYear, this.currentYear + 1]
      arr.forEach((item) => {
        obj.year = item
        obj.days = this.isLeapYear(item) ? 365 : 366
        this.allDays.push(obj)
        obj = {}
      })

      this.checkDate()
    },
    // 根据年份天数创建月份及月份天数数组
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
      // console.log(arr);
      return arr
    },
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
      // document.querySelector('.todayNum').scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'start',
      //   inline: 'center'
      // })
    },
    handleCurrentLineDay (data) {
      this.currentLineDay = data
    },
    currentLineDayInit (data) {
      this.currentLineDay = data
    },
    handleTimeChange (data) {
      const first = this.list.findIndex((first) => {
        return first.id === data.parentId
      })
      const second = this.list[first].children.findIndex((second) => {
        return second.id === data.id
      })
      this.list[first].children[second].startTime = data.startTime
      this.list[first].children[second].endTime = data.endTime
    },
    // 根据时间计算距离
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
    submit (val) {
      const obj = Object.assign({}, val)
      const index = this.list.length
      console.log(obj, index)
      obj.startTime = obj.planTime.length > 0 ? obj.planTime[0] : obj.stoneTime
      obj.endTime = obj.planTime.length > 0 ? obj.planTime[1] : obj.stoneTime

      if (obj.type !== 3) {
        obj.left = this.computedTimeWidth(obj.startTime)
        obj.widthMe = obj.widthChild = this.computedTimeWidth(obj.startTime, obj.endTime)
        // console.log(obj.type);
        if (index === 0) {
          obj.top = 6
        } else {
          if (this.list[index - 1].children && this.list[index - 1].children.length > 0) {
            obj.top =
              this.list[index - 1].children[this.list[index - 1].children.length - 1].top + 40
          } else {
            obj.top = this.list[index - 1].top + 40
          }
        }
      }
      if (obj.type === 2) {
        obj.per = 100
      }
      if (obj.type === 3) {
        obj.per = 0
        obj.id = new Date().getTime()
        obj.expand = true
        if (index === 0) {
          obj.top = 6
        } else {
          if (this.list[index - 1].children && this.list[index - 1].children.length > 0) {
            obj.top =
              this.list[index - 1].children[this.list[index - 1].children.length - 1].top + 40
          } else {
            obj.top = this.list[index - 1].top + 40
          }
        }
      }
      obj.id = new Date().getTime()
      obj.isShow = true
      if (this.isChildren && this.currentListIndex !== '') {
        const row = this.list[parseInt(this.currentListIndex)]
        row.children = row.children ? row.children : []
        const cindex = row.children.length
        obj.top = 40 + cindex * 40 + row.top
        obj.parentId = row.id
        row.children.push(obj)
        row.children.forEach((item) => {
          item.isShow = true
        })
        this.setGroupWidth(row.id)
        this.setGroupPer(row.id)
        this.resetTop(this.currentListIndex)
        this.$set(this.list, parseInt(this.currentListIndex), row)
        console.log(row)
      } else {
        this.list.push(obj)
      }
      if (obj.type !== '3') {
        this.handlerRowClick(obj)
      }
      this.currentListIndex = ''
      this.isChildren = false
      this.dialogFormVisible = false
    },
    // 根据id设置group的宽度
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
    // 设置分组百分比
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
