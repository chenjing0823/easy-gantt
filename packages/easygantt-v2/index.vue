<template>
  <div class="easy-gantt-v2">
    <div class="gantt-time">
      <span>时间轴</span>
      <el-button size="small" @click="gotoday">今天</el-button>
      <el-select size="small" v-model="currentDaySize.value" @change="handleSetDaySize" placeholder="请选择">
        <el-option
          v-for="item in currentDaySizeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="gantt-content">
      <div class="gantt-left">
        <div class="search">
          <el-input v-model="search" placeholder="请输入内容" size="mini"> </el-input>
        </div>

        <left-card
          :list="list"

          :sliderRowId="sliderRowId"
          :style="{ width: leftWidth + 'px' }"
          @handlerNewTask="handlerNewTask"
          @handlerEditStage="handlerEditStage"
          @handlerNewStage="handlerNewConfirm"
          @handlerDeleStage="handlerDeleStage"
          @handlerOperateTask="handlerOperateTask"
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
          :dayLength="dayLength"
          @gotoday="gotoday"
          @currentLineDayInit="currentLineDayInit"
          @handleCurrentLineDay="handleCurrentLineDay"
          @handleTimeChange="handleTimeChange"
          @handlerSelect="handlerSelect"
        >
        </gantt-body>
      </div>
    </div>
    <gantt-add
      :dialogFormVisible.sync="dialogFormVisible"
      @handlerNewConfirm="handlerNewConfirm" />
  </div>
</template>

<script>
import LeftCard from './components/left-card'
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
      default: 280
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
      dayLength: 0,
      // 月数
      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      // 当前的时间大小
      currentDaySize: {
        label: '天',
        value: 60
      },
      currentDaySizeOptions: [
        {
          label: '天',
          value: 60
        },
        {
          label: '月',
          value: 6
        },
        {
          label: '季',
          value: 2
        },
        {
          label: '年',
          value: 1.5
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
      dataListNew: [],
      sliderRowId: '' // 鼠标所在滑块对应的左侧id
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
      const newVal = (item, left, widthMe, widthChild) => {
        item[left] = (item[left] / oldValue) * newValue
        item[widthMe] = item[widthChild] = (item[widthMe] / oldValue) * newValue
      }
      const widthFormat = (list) => {
        list.forEach(item => {
          newVal(item, 'left', 'widthMe', 'widthChild')
          if (item.widthMeShow) {
            newVal(item, 'leftShow', 'widthMeShow', 'widthChildShow')
          }
          if (item.children && item.children.length > 0) {
            widthFormat(item.children)
          }
        })
      }
      widthFormat(this.list)
    }
  },

  mounted () {
    this.getDay()
    // this.dataFormat()
  },

  methods: {
    /**
     * @description: 数据格式化，拿到每个甘特图节点的位置信息
     */
    dataFormat () {
      const getAllList = (dataList, isChildren = false, currentListIndex = '') => {
        let arr = []
        dataList.forEach((item, index) => {
          // debugger
          item.isChildren = isChildren // 是否子任务
          item.currentListIndex = currentListIndex // 子任务所在的父index

          if (!item.children || item.children.length < 1) {
            arr.push(item)
          } else if (item.children && item.children.length >= 1) {
            const _item = JSON.parse(JSON.stringify(item))
            delete _item.children
            arr.push(_item)
            let _index = index
            if (_item.level === 1 || _item.level === 2) {
              _index = _item.currentListIndex
            }
            arr = arr.concat(getAllList(item.children, true, _index)) // children数组，是子任务，最外层父节点index
          }
        })
        return arr
      }
      console.log(getAllList(this.dataList))
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
      this.dayLength = days[days.length - 1].width
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
      const callback = () => {
        const _data = data
        const { originIds } = _data.data
        const upLevelIndex = (data, parentId) => {
          const index = data.findIndex((up) => {
            return up.id === parentId
          })
          return index
        }
        const dataIndex = (data) => {
          const index = data.findIndex((item) => {
            return item.id === _data.id
          })
          return index
        }
        const out = upLevelIndex(this.list, originIds[0])
        const index = dataIndex(this.list[out].children)
        this.list[out].children[index].startTime = _data.startTime
        this.list[out].children[index].endTime = _data.endTime
      }
      this.$emit('handleTimeChange', data, callback)
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
      if (!startTime) {
        return 0
      } else if (!endTime) {
        return left
      } else {
        return width
      }
    },
    handlerSelect (row) {
      this.sliderRowId = row ? row.id : ''
    },
    /**
     * @description: 新增提交数据
     * @param: {Object} 表格内容
     * @param: {Number} index 插入数据的下标
     * @param: {Function} [callback] 成功后回调
     */
    handlerNewConfirm (val, listIndex = '', callback) {
      const obj = Object.assign({}, val)
      const startTime = obj.planTime.length > 0 ? obj.planTime[0] : obj.stoneTime
      const endTime = obj.planTime.length > 0 ? obj.planTime[1] : obj.stoneTime
      this.$set(obj, 'startTime', startTime)
      this.$set(obj, 'endTime', endTime)

      this.$emit('handlerNewStage', listIndex, obj, () => {
        this.pushData(obj, false, listIndex)
        if (obj.type !== '3') {
          this.handlerRowClick(obj)
        }
        this.currentListIndex = ''
        this.isChildren = false
        this.dialogFormVisible = false
        callback && callback()
      })
    },
    /**
     * @description: 插入数据
     */
    pushData (obj, isInit = false, listIndex = '') {
      const isChildren = obj.isChildren || this.isChildren
      const currentListIndex = this.currentListIndex !== '' ? this.currentListIndex : obj.currentListIndex
      const index = this.list.length
      this.$set(obj, 'expand', true)
      this.$set(obj, 'left', this.computedTimeWidth(obj.startTime))
      this.$set(obj, 'widthMe', this.computedTimeWidth(obj.startTime, obj.endTime))
      this.$set(obj, 'widthChild', this.computedTimeWidth(obj.startTime, obj.endTime))
      if (obj.type === '3' || obj.hasChildren) {
        this.$set(obj, 'leftShow', this.computedTimeWidth(obj.startTime))
        this.$set(obj, 'widthMeShow', this.computedTimeWidth(obj.startTime, obj.endTime))
        this.$set(obj, 'widthChildShow', this.computedTimeWidth(obj.startTime, obj.endTime))
      }
      if (obj.type !== '3') {
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
      if (obj.type === '2') {
        obj.per = 100
      } else if (obj.type === '3') {
        if (!isInit) {
          obj.per = 0
        }
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
          childrenTop += 5 // 阶段直接有5像素的距离
        }
        this.$set(obj, 'top', childrenTop)
      }
      obj.id = obj.id || new Date().getTime()
      this.$set(obj, 'isShow', true)
      if (isChildren && currentListIndex !== '') {
        const row = this.list[currentListIndex]

        row.children = row.children ? row.children : []
        this.$set(row, 'expand', true) // 展开有操作 需要响应
        const cindex = row.children.length
        obj.top = 40 + cindex * 40 + row.top

        row.children.push(obj)
        row.children.forEach((item) => {
          item.isShow = true
        })
        if (!isInit) {
          this.$set(obj, 'originIds', [row.id])
          this.$set(obj, 'level', 1)
          this.setGroupWidth([row.id])
          this.setGroupPer(row.id)
          this.resetTop(currentListIndex)
        }
        if (obj.level === 1) {
          this.$set(obj, 'parentId', row.id)
        }
        this.$set(this.list, currentListIndex, row)
      } else {
        if (listIndex !== '') {
          // this.$set(this.list, listIndex, obj)
          this.list.splice(listIndex, 0, obj)
          this.reComputed()
        } else {
          this.$set(this.list, index, obj)
        }
        // this.list.push(obj)
      }
    },
    /**
     * @description: 需要重新计算高度进行排序
     */
    reComputed () {
      this.$parent.dataList = JSON.parse(JSON.stringify(this.list))
      this.$parent.list = []
      this.$nextTick(() => {
        this.dataFormat()
      })
      // console.log(this.list)
    },
    handlerDeleStage (index) {
      const callback = () => {
        this.list.splice(index, 1)
        this.reComputed()
      }
      this.$emit('handlerDeleStage', index, callback)
    },
    handlerOperateTask (type, data) {
      this.$emit('handlerOperateTask', type, data)
    },
    /**
     * @description: 编辑数据
     * @param: {Object} 编辑内容
     * @param: {Number} index 编辑数据的下标
     * @param: {Function} [callback] 成功后回调
     */
    handlerEditStage (data, index, callback) {
      const { name, planTime } = data
      const dataSet = () => {
        const data = this.list[index]
        data.name = name
        data.startTime = planTime[0]
        data.endTime = planTime[1]
        data.left = this.computedTimeWidth(planTime[0])
        data.widthMe = this.computedTimeWidth(planTime[0], planTime[1])
        data.widthChild = this.computedTimeWidth(planTime[0], planTime[1])
        data.leftShow = this.computedTimeWidth(planTime[0])
        data.widthMeShow = this.computedTimeWidth(planTime[0], planTime[1])
        data.widthChildShow = this.computedTimeWidth(planTime[0], planTime[1])
      }

      this.$emit('handlerEditStage', index, data, dataSet)

      callback && callback()
    },
    // 根据id设置group的宽度
    setGroupWidth ([id, level1, level2], obj) {
      const parent = this.list.find((item) => {
        return item.id === id
      })
      const left = []
      const leftLevel1 = []
      const leftLevel2 = []
      const arr = []
      const arrLevel1 = []
      const arrLevel2 = []
      parent.children.forEach((item) => {
        if (item.originIds.includes(level2)) {
          leftLevel2.push(item.left)
          arrLevel2.push(item.left + item.widthMe)
        } else if (item.originIds.includes(level1)) {
          leftLevel1.push(item.left)
          arrLevel1.push(item.left + item.widthMe)
        } else {
          left.push(item.left)
          arr.push(item.left + item.widthMe)
        }
      })
      const setWidth = (parent, arr, leftArr) => {
        const left = Math.min.apply(
          Math,
          leftArr
        )
        const width = Math.max.apply(Math, arr)
        const widthMe = width - left
        parent.widthMeShow = parent.widthChildShow = widthMe
        parent.leftShow = left
      }
      // 优先处理最小可展开层 再往上调用
      if (level2) {
        if (obj && obj[level2]) return // 已经初始化过group 不再重复初始化 节约性能
        const task = parent.children.find((item) => {
          return item.id === level2
        })
        setWidth(task, arrLevel2, leftLevel2)
        this.setGroupWidth([id, level1])
      } else if (level1) {
        if (obj && obj[level1]) return // 已经初始化过group 不再重复初始化 节约性能
        const task = parent.children.find((item) => {
          return item.id === level1
        })
        setWidth(task, arrLevel1, leftLevel1)
        this.setGroupWidth([id])
      } else {
        if (obj && obj[id]) return // 已经初始化过group 不再重复初始化 节约性能
        setWidth(parent, arr, left)
      }
      if (obj) {
        // 代表初始化
        if (level2 && !obj[level2]) {
          obj[level2] = true
        } else if (level1 && !obj[level1]) {
          obj[level1] = true
        } else if (id && !obj[id]) {
          obj[id] = true
        }
      }
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
  flex-direction: column;
  // background-color: #F4F4F4;
}
.gantt-time {
  flex: none;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #F2F3F5;
}
.gantt-content {
  display: flex;
  height: calc(100% - 50px);
  box-sizing: border-box;
  border: 1px solid #F2F3F5;
  border-top: none;
}
.gantt-left {
  flex: none;
  display: flex;
  flex-direction: column;
  position: relative;
  .search {
    flex: none;
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
  border-left: 1px solid #F2F3F5;
  z-index: 1;
  background-color: #ffffff;
}
</style>
