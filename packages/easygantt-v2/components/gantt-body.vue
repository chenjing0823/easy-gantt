<template>
  <div class="gantt-body">
    <!-- <div
      class="row-line"
      :style="{ top: (index + 1) * 40 + 49 + 'px' }"
      v-for="(item, index) in computedList"
      :key="index"
    ></div> -->
    <div class="lineBG" :style="{width: dayLength + 'px'}">
      <svg v-if="movePoints.endX" class="drag-line-svg">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" class="svg-marker" />
          </marker>
        </defs>
        <line :x1="movePoints.startX" :y1="movePoints.startY" :x2="movePoints.endX" :y2="movePoints.endY" marker-end="url(#arrow)" class="svg-line" />
      </svg>
      <!-- <div v-for="item in 100" :key="item" style="position: absolute;" :style="{top: item * 30 + 'px',left: item * 50 + 'px'}">123</div> -->
      <template v-for="(item, index) in computedLine">
        <seriesLine
          :currentDaySize="currentDaySize"
          :point-data="item"
          :key="index + 'lll'"
          @handelDeletepre="handelDeletepre"></seriesLine>
      </template>
      <template v-for="(item, index) in computedList">
        <div
          class="line"
          :style="{
            left: item.left + 'px',
            width: item.widthMe + 'px',
            top: item.top + 'px'
          }"
          v-if="isTask(item)"
          :ref="'line' + item.id"
          :key="item.id + index + 'ccc'"
          @mousedown="lineMousedown(`line${item.id}`, $event, item.id, item.parentId, index, item)"
          @mouseover="lineMouseover(`line${item.id}`, $event, item.id, item.parentId, index, item)"
          @mouseleave="lineMouseleave"
          @mouseenter="lineMouseenter(`line${item.id}`, $event, item.id, item.parentId, index, item)"
        >
          <slider
            :min="0"
            :max="100"
            v-model="item.per"
            :id="item.id"
            :top="item.top"
            :left="item.left"
            :parentId="item.parentId"
            :widths="item.widthChild"
            v-if="item.type === '1'"
          ></slider>

          <template v-else-if="item.type === '2'">
            <div
              class="stoneLine"
              :style="{ top: -item.top + 'px', height: lineBGHeight }"
              @mouseenter="stoneLineMouseenter"
            ></div>
            <div class="milestone">
              <i class="el-icon-s-flag"></i>
            </div>
          </template>

          <div
            class="dragBox"
            :data-end-id="item.id"
            :data-end-top="item.top + 14"
            :data-end-left="item.left"
            v-show="hoverId === item.id && item.type !== '2'">
            <slider
              :min="0"
              :max="100"
              v-model="item.per"
              :id="item.id"
              :top="item.top"
              :left="item.left"
              :parentId="item.parentId"
              :widths="item.widthChild"
              v-show="item.type === '1'"
            ></slider>
          </div>
          <div
            class="leftCurDrag curdrag"
            v-show="item.type === '1' && hoverId === item.id"
            @mousedown.stop="
              leftCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index, item)
            "
          >||</div>
          <div
            class="rightCurDrag curdrag"
            v-show="item.type === '1' && hoverId === item.id"
            @mousedown.stop="
              rightCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index, item)
            "
          >||</div>
          <!-- <div
            class="leftcurPoint curPoint"
            v-show="item.type === '1' && hoverId === item.id"
            @mousedown.stop="
              leftcurPointMounsedown(`line${item.id}`, $event, item.id, item.parentId, index, item)
            "></div> -->
          <div
          class="rightcurPoint curPoint"
            v-show="item.type === '1' && hoverId === item.id"
            @mousedown.stop="
              rightcurPointMounsedown(`line${item.id}`, $event, item.id, item.parentId, index, item)
            "></div>
        </div>
        <!-- 父级条 -->
        <group
          v-else-if="isGroup(item)"
          :key="item.id"
          :item="item"
          :isMove="isMove"
          @groupMouseEnter="groupMouseEnter"
          ></group>

      </template>
      <!-- 占位格，保持高度与左侧滚动区域一致 -->
      <div class="null-block"
        v-if="computedList.length"
        :style="{
          left: computedList[computedList.length - 1].left + 'px',
          top: computedList[computedList.length - 1].top + 45 + 'px'
        }"></div>
    </div>
  </div>
</template>

<script>
import seriesLine from './series-line.vue'
import slider from './silder.vue'
import group from './group.vue'
export default {
  name: 'gantt-body',

  components: {
    slider,
    group,
    seriesLine
  },

  filters: {},

  mixins: [],
  props: {
    leftWidth: {
      type: Number
    },
    list: {
      type: Array,
      default: () => []
    },
    line: {
      type: Array,
      default: () => []
    },
    dayLength: {
      type: Number,
      required: true
    },
    currentDaySize: {
      type: Object,
      default: () => {
        return {
          label: '天',
          value: 60
        }
      }
    },
    currentLineDay: {
      type: Object,
      default: () => {
        return {
          start: 0,
          end: 0
        }
      }
    },
    isHover: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      hoverId: '',
      hoverGroupId: '',
      isMove: false,
      // 背景高度
      lineBGHeight: '0px',
      initFlag: false,
      movePoints: {}
    }
  },

  computed: {
    computedLine () {
      const arr = []
      const showLine = this.computedList.length && this.line.length
      showLine && this.line.forEach((item) => {
        const start = this.computedList.find((i) => i.id === item.sourceid)
        const end = this.computedList.find((i) => i.id === item.targetid)
        if (!start || !end) return
        arr.push({
          id: item.id,
          startX: start.left + start.widthMe,
          startY: start.top + 12,
          endX: end.left,
          endY: end.top + 14
        })
      })
      return arr
    },
    computedList () {
      let index = 0 // 展示数据的下标
      let allIndex = 0 // 所有数据的下标
      const dataFormat = (dataList) => {
        let arr = []
        dataList.forEach((item) => {
          if (!item.isShow) {
            allIndex++
            return
          }
          // 展示数据的小标 跟其在所有数据下标不一致，说明前面有 allIndex - index 条隐藏不展示数据
          if (index !== allIndex) {
            item.top = item.top - (allIndex - index) * 40
          }
          allIndex++
          if (!item.children || item.children.length < 1) {
            arr.push(item)
            index++
          } else if (item.children && item.children.length >= 1) {
            const _item = JSON.parse(JSON.stringify(item))
            delete _item.children
            arr.push(_item)
            index++
            arr = arr.concat(dataFormat(item.children)) // children数组，是子任务，父节点index
          }
        })
        return arr
      }
      const list = JSON.parse(JSON.stringify(this.list))
      return dataFormat(list)
    },
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
    computedList: {
      handler (val) {
        if (!this.initFlag) {
          const obj = {}
          val.forEach(data => {
            if (data.originIds && data.originIds.length && !data.hasChildren) {
              this.setGroupWidth(data.originIds, obj)
            }
          })
          this.initFlag = true
        }
      },
      deep: true
    }
  },

  mounted () {
    this.setStoneLine()
  },

  methods: {
    isTask (item) {
      const { type, isShow, hasChildren, expand } = item
      return (['1', '2'].includes(type) && isShow && (!hasChildren || !expand)) || (this.hoverGroupId === item.id && type !== '3')
    },
    isGroup (item) {
      const { type, hasChildren, expand } = item
      return type === '3' || (hasChildren && expand) || (['1', '2'].includes(type) && this.hoverGroupId !== item.id)
    },
    // 设置里程碑线的高度
    setStoneLine (isFirst) {
      this.$nextTick(() => {
        const height = getComputedStyle(document.querySelector('.lineBG')).height
        this.lineBGHeight = height

        this.$emit('gotoday')
      })
    },
    handelDeletepre (id, callback) {
      this.$emit('handelDeletepre', id, callback)
    },
    // 每一行拖拽
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     * @param  {Object} data data
     */
    lineMousedown (dom, e, id, parentId, index, data) {
      const line = this.$refs[dom][0]
      const initX = e.pageX
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      let result
      let z = 0
      let left
      // console.log(cp);
      document.onmousemove = (event) => {
        this.isMove = true
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        const clientWidth = ganttBlock.width
        // event.pageX - ganttBlock.left 鼠标距离 gantt-right 左侧位置
        if (event.pageX - ganttBlock.left >= clientWidth - this.currentDaySize.value) {
          z = scrollX + this.currentDaySize.value
          // window.scrollTo(z, 0);
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          const newWith = event.pageX - initX + scrollX - initScrollX

          result = this.computedList[index].left + newWith
          line.style.left = result + 'px'
          if (result <= 0) result = 0
        } else if (event.pageX - ganttBlock.left <= 0) {
          z = scrollX - this.currentDaySize.value
          // window.scrollTo(z, 0);
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          const newWith = event.pageX - initX + scrollX - initScrollX

          result = this.computedList[index].left + newWith
          if (result <= 0) result = 0
          line.style.left = result + 'px'
        } else {
          const newWith = event.pageX - initX + scrollX - initScrollX

          result = this.computedList[index].left + newWith
          if (result <= 0) result = 0
          line.style.left = result + 'px'
        }
        this.lineMouseover(dom, e, id, parentId, index, data)
        // this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (!result) {
          document.onmousemove = document.onmouseup = null
          return
        }
        left = Math.round(result / this.currentDaySize.value) * this.currentDaySize.value
        this.computedList[index].left = left
        line.style.left = left + 'px'
        this.checkIsin(dom, events, id, parentId, index, data)
        if (parentId) {
          const rootId = data.originIds[0] // 实际上三层任务是平铺开，渲染时候只有1层，通过标记渲染成3层。实际2层 外层id为originIds[0]
          this.list.forEach((item) => {
            if (item.id === rootId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.left = left
                }
              })
            }
          })
          if (data.level === 1) {
            this.setGroupWidth([rootId])
          } else if (data.level === 2) {
            const level1 = data.originIds[1]
            this.setGroupWidth([rootId, level1])
          } else if (data.level === 3) {
            const level1 = data.originIds[1]
            const level2 = data.originIds[2]
            this.setGroupWidth([rootId, level1, level2])
          }
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.left = left
            }
          })
        }
        this.isMove = false
        document.onmousemove = document.onmouseup = null
      }
    },
    changeTime (dom, e, id, parentId, index, data) {
      const start =
        Math.round(parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value) *
          this.currentDaySize.value +
        this.currentDaySize.value
      let end = parseInt(this.$refs[dom][0].style.left) + parseInt(this.$refs[dom][0].style.width)
      end = Math.round(end / this.currentDaySize.value) * this.currentDaySize.value
      const obj = {
        id,
        parentId,
        index,
        startTime: this.computedWithTime(start - this.currentDaySize.value, true),
        endTime: this.computedWithTime(end - this.currentDaySize.value, true),
        data
      }
      console.log(this.computedWithTime(start - this.currentDaySize.value, false))
      console.log(this.computedWithTime(end - this.currentDaySize.value, false))
      this.$emit('handleTimeChange', obj)
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     * @param  {Object} data data
     */
    // 鼠标悬停展示上部日期
    lineMouseover (dom, e, id, parentId, index, data) {
      const start =
        Math.round(parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value) *
          this.currentDaySize.value +
        this.currentDaySize.value
      let end = parseInt(this.$refs[dom][0].style.left) + parseInt(this.$refs[dom][0].style.width)
      end = Math.round(end / this.currentDaySize.value) * this.currentDaySize.value
      const currentLineDay = {
        start,
        end
      }
      this.$emit('handleCurrentLineDay', currentLineDay)
      this.$emit('update:isHover', true)
      this.handlerSelect(this.computedList[index])
      this.lineMouseenter(dom, e, id, parentId, index, data)
    },
    // 鼠标离开信息消失，时间显示消失
    /**
     * @param  {Object} e $event
     * @param  {Boolean} move 是否移动状态
     */
    lineMouseleave (e, move) {
      const currentLineDay = {
        start: 0,
        end: 0
      }
      this.$emit('currentLineDayInit', currentLineDay)
      this.$emit('update:isHover', false)
      this.hoverId = ''
      console.log('this.isMove', this.isMove)
      if (!this.isMove) {
        this.hoverGroupId = ''
      }
      this.handlerSelect()
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     * @param  {Object} data data
     */
    // 鼠标进入显示当前项目的基本信息框
    lineMouseenter (dom, e, id, parentId, index, data) {
      if (this.isMove) {
        return
      }
      this.hoverId = id
      this.hoverGroupId = id
    },
    // 里程碑去掉mouseenter显示
    stoneLineMouseenter () {
      const currentLineDay = {
        start: 0,
        end: 0
      }
      this.$emit('currentLineDayInit', currentLineDay)
    },
    // 根据index值和e判断是否在当前line的范围里，是否展示时间和msg框
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    checkIsin (dom, events, id, parentId, index, data) {
      const line = this.$refs[dom][0] // 目标silder
      const targetElement = events.target || events.srcElement // 鼠标最后的元素
      if (line.contains(targetElement)) {
        this.lineMouseover(dom, events, id, parentId, index, data)
        this.lineMouseenter(dom, events, id, parentId, index, data)
      } else {
        const currentLineDay = {
          start: 0,
          end: 0
        }
        this.$emit('currentLineDayInit', currentLineDay)
      }
      this.changeTime(dom, events, id, parentId, index, data)
    },
    // 根据距离计算时间
    /**
     * @param  {Number} width
     * @param  {Boolean|String} time
     */
    computedWithTime (width, time) {
      const startTime =
        (width / this.currentDaySize.value) * (1000 * 60 * 60 * 24) +
        new Date(`${this.currentYear - 1}/01/01`).getTime()
      const s = new Date(startTime)
      if (time && time === true) {
        return s.getTime()
      } else if (time && time === 'YD') {
        return `${s.getFullYear()}年${s.getMonth() + 1}月`
      } else {
        return `${s.getFullYear()}年${s.getMonth() + 1}月${s.getDate()}日`
      }
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
    // 设置左侧leftmenu高亮
    handlerSelect (row) {
      this.$emit('handlerSelect', row)
    },
    // 左侧拖拽增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    leftCurDragMounsedown (dom, e, id, parentId, index, data) {
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      const line = this.$refs[dom][0]
      const cx = e.pageX
      let result
      let result1
      let z = 0
      let addwidth
      document.onmousemove = (event) => {
        this.isMove = true
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        if (event.pageX - ganttBlock.left <= this.currentDaySize.value) {
          z = scrollX - this.currentDaySize.value
          // window.scrollTo(z, 0);
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          addwidth = -(event.pageX - cx + scrollX - initScrollX)
        } else {
          addwidth = -(event.pageX - cx)
        }
        console.log(addwidth)
        result = this.computedList[index].widthMe + addwidth
        result1 = this.computedList[index].left - addwidth
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value
          result1 =
            this.computedList[index].left +
            this.computedList[index].widthMe -
            this.currentDaySize.value
        } else if (result1 <= 0) {
          result1 = 0
          // console.log(result1);
        }
        line.style.width = result + 'px'
        line.style.left = result1 + 'px'
        this.computedList[index].widthChild = result
        this.lineMouseover(dom, e, id, parentId, index, data)
        // this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (!result) {
          document.onmousemove = document.onmouseup = null
          return
        }
        result = Math.round(result / this.currentDaySize.value) * this.currentDaySize.value
        result1 =
          Math.round(parseInt(line.style.left) / this.currentDaySize.value) *
          this.currentDaySize.value
        this.computedList[index].widthMe = result
        this.computedList[index].widthChild = result
        line.style.width = result + 'px'
        this.computedList[index].left = result1
        line.style.left = result1 + 'px'
        this.checkIsin(dom, events, id, parentId, index, data)
        // this.setComputedListGroupWidth(parentId);
        if (parentId) {
          const rootId = data.originIds[0] // 实际上三层任务是平铺开，渲染时候只有1层，通过标记渲染成3层。实际2层 外层id为originIds[0]
          this.list.forEach((item) => {
            if (item.id === rootId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.widthMe = k.widthChild = result
                  k.left = result1
                }
              })
            }
          })
          if (data.level === 1) {
            this.setGroupWidth([rootId])
          } else if (data.level === 2) {
            const level1 = data.originIds[1]
            this.setGroupWidth([rootId, level1])
          } else if (data.level === 3) {
            const level1 = data.originIds[1]
            const level2 = data.originIds[2]
            this.setGroupWidth([rootId, level1, level2])
          }
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.widthMe = item.widthChild = result
              item.left = result1
            }
          })
        }
        this.isMove = false
        document.onmousemove = document.onmouseup = null
      }
    },
    // 右侧边缘增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    rightCurDragMounsedown (dom, e, id, parentId, index, data) {
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      const line = this.$refs[dom][0]
      const cx = e.pageX
      let result
      let z = 0
      let addwidth
      document.onmousemove = (event) => {
        this.isMove = true
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        const clientWidth = ganttBlock.width
        if (event.pageX - ganttBlock.left >= clientWidth - this.currentDaySize.value) {
          z = scrollX + this.currentDaySize.value
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          addwidth = event.pageX - cx + scrollX - initScrollX
        } else if (event.pageX - ganttBlock.left <= this.currentDaySize.value) {
          z = scrollX - this.currentDaySize.value
          // window.scrollTo(z, 0);
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          addwidth = event.pageX - cx + scrollX - initScrollX
        } else {
          addwidth = event.pageX - cx
        }
        result = this.computedList[index].widthMe + addwidth
        line.style.width = result + 'px'
        this.computedList[index].widthChild = result
        // console.log(line.style.width);
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value
          line.style.width = result + 'px'
          this.computedList[index].widthMe = result
          this.computedList[index].widthChild = result
        }
        this.lineMouseover(dom, e, id, parentId, index, data)
        // this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (!result) {
          document.onmousemove = document.onmouseup = null
          return
        }
        result = Math.round(result / this.currentDaySize.value) * this.currentDaySize.value
        this.computedList[index].widthMe = result
        this.computedList[index].widthChild = result
        line.style.width = result + 'px'
        this.checkIsin(dom, events, id, parentId, index, data)
        if (parentId) {
          const rootId = data.originIds[0] // 实际上三层任务是平铺开，渲染时候只有1层，通过标记渲染成3层。实际2层 外层id为originIds[0]
          this.list.forEach((item) => {
            if (item.id === rootId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.widthMe = k.widthChild = result
                  // k.left = result1;
                }
              })
            }
          })
          if (data.level === 1) {
            this.setGroupWidth([rootId])
          } else if (data.level === 2) {
            const level1 = data.originIds[1]
            this.setGroupWidth([rootId, level1])
          } else if (data.level === 3) {
            const level1 = data.originIds[1]
            const level2 = data.originIds[2]
            this.setGroupWidth([rootId, level1, level2])
          }
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.widthMe = item.widthChild = result
              // item.left = result1;
            }
          })
        }
        this.isMove = false
        document.onmousemove = document.onmouseup = null
      }
    },
    // leftcurPointMounsedown (dom, e, id, parentId, index, data) {},
    rightcurPointMounsedown (dom, e, id, parentId, index, data) {
      // const cx = e.pageX
      // const cy = e.pageY
      const { top, left, widthMe } = data
      const startX = left + widthMe
      const startY = top + 14
      this.$set(this.movePoints, 'id', new Date().getTime())
      this.$set(this.movePoints, 'isDrag', true)
      this.$set(this.movePoints, 'startX', startX)
      this.$set(this.movePoints, 'startY', startY)
      const arr = []
      const element = document.querySelector('.lineBG')
      const callback = (e) => {
        // if (e.target.classNmae)
        const isChangeEvent = e.target.classList.contains('lineBG') || e.target.classList.contains('slider') || e.target.classList.contains('process')
        if (!isChangeEvent && e.target.style.pointerEvents !== 'none') {
          e.target.style.pointerEvents = 'none'
          arr.push(e.target)
          return
        }
        // document.querySelector('.series-line').style.pointerEvents = 'none'
        const scrollY = document.querySelector('.lineBG').scrollTop
        let endX = e.offsetX
        let endY = e.offsetY + scrollY
        const { endId, endTop, endLeft, endWidth } = e.target.dataset
        if (endId) {
          endX = +endLeft + Math.floor(+endWidth / 2)
          endY = +endTop
        }
        this.$set(this.movePoints, 'endX', endX)
        this.$set(this.movePoints, 'endY', endY)
      }
      element.addEventListener('mousemove', callback)
      document.onmouseup = (events) => {
        const { endId } = events.target.dataset
        if (endId) {
          this.line.push({
            id: new Date().getTime(),
            sourceid: id,
            targetid: +endId
          })
        }
        this.movePoints = {}
        arr.forEach(dom => {
          dom.style.pointerEvents = 'auto'
        })
        document.onmouseup = null
        element.removeEventListener('mousemove', callback)
      }
    },
    groupMouseEnter (id) {
      this.hoverGroupId = id
      this.hoverId = id
    }
  }
}
</script>

<style lang="stylus" scoped>
.gantt-body {
  height: 100%;
  .lineBG {
    width: 100%;
    height: calc(100% - 0px);
    position: relative;
    overflow-y: scroll;
    .drag-line-svg {
      height: 100%;
      width: 100%;
      z-index:1;
    }
    .svg-line {
      stroke: #4DACFF;
      stroke-width: 2
    }
    .svg-marker {
      fill: #4DACFF;
    }
    .null-block {
      position: absolute;
      height: 37px;
      width: 20px;
    }
    .line {
      position: absolute;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      .curPoint {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2px solid #4DACFF;
        top: 7px;
        // 24/2 - 10/2 = 7
      }
      .leftcurPoint {
        left: -20px;
      }
      .rightcurPoint {
        right: -20px;
      }
      .curdrag {
        color: #4E5969;
        width: 10px;
        background-color: #ffffff;
        height: 26px !important;
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        border-radius: 3px;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .rightCurDrag {
        cursor: e-resize;
        right: -10px;
      }
      .leftCurDrag {
        cursor: w-resize;
        left: -10px;
      }
      .dragBox {
        border-radius: 4px;
        position: absolute;
        padding: 4px 10px;
        top: -4px;
        left: -10px;
        height: 24px;
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      }
      .stoneLine {
        position: absolute;
        top: 0;
        left: 50%;
        bottom: 0;
        // margin-left: -1px;
        width: 1px;
        background-color: #FF8C2E;
      }
      .milestone {
        position: absolute;
        font-size: 12px;
        left: 50%;
        // transform: translateX(-50%);
        cursor: move;
        margin-left: -10px;
        width: 20px;
        height: 20px;
        background-color: #FF8C2E;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          transform: rotate(45deg);
          color: #fff;
          z-index: 1;
        }
      }
    }
  }
  .projectMsg {
    box-sizing: border-box;
    padding: 20px;
    position: absolute;
    width: 220px;
    height: 200px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    z-index: 3;
    .lineMsg {
      margin-bottom: 10px;
      .projectName {
        font-size: 22px;
      }
      span {
        font-size: 14px;
        color: #909090;
      }
      .title {
        margin-right: 10px;
      }
    }
  }
}
</style>
