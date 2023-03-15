<template>
  <div class="gantt-body">
    <div
      class="row-line"
      :style="{ top: (index + 1) * 40 + 49 + 'px' }"
      v-for="(item, index) in computedList"
      :key="index"
    ></div>
    <div class="lineBG">
      <template v-for="(item, index) in computedLine">
        <seriesLine :data="item" :point-data="item" :key="index"></seriesLine>
      </template>
      <template v-for="(item, index) in computedList">
        <div
          class="line"
          :style="{
            left: item.left + 'px',
            width: item.widthMe + 'px',
            top: item.top + 'px'
          }"
          v-if="(item.type === '1' || item.type === '2') && item.isShow"
          :ref="'line' + item.id"
          :key="item.id + index + 'ccc'"
          @mousedown="lineMousedown(`line${item.id}`, $event, item.id, item.parentId, index)"
          @mouseover="lineMouseover(`line${item.id}`, $event, item.id, item.parentId, index)"
          @mouseleave="lineMouseleave"
          @mouseenter="lineMouseenter(`line${item.id}`, $event, item.id, item.parentId, index)"
        >
          <slider
            :min="0"
            :max="100"
            v-model="item.per"
            :id="item.id"
            :parentId="item.parentId"
            :widths="item.widthChild"
            v-show="item.type === '1'"
          ></slider>
          <div
            class="leftCurDrag"
            v-show="item.type == '1' && hoverId === item.id"
            @mousedown.stop="
              leftCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index)
            "
          ></div>
          <div
            class="rightCurDrag"
            v-show="item.type == '1' && hoverId === item.id"
            @mousedown.stop="
              rightCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index)
            "
          ></div>
          <div
            class="stoneLine"
            :style="{ top: -item.top + 'px', height: lineBGHeight }"
            v-if="item.type == '2'"
            @mouseenter="stoneLineMouseenter"
          ></div>
          <div class="milestone" v-if="item.type == '2'">
            <i class="el-icon-s-flag"></i>
          </div>
        </div>
        <div
          class="group"
          :style="{
            top: item.top + 'px',
            left: item.left + 'px',
            width: item.widthMe + 'px'
          }"
          v-else-if="item.type === '3'"
          :key="item.id + 'zzzzz'"
        >
          <div class="progress" :style="{ width: item.per + '%' }"></div>
        </div>
      </template>
    </div>
    <transition name="el-zoom-in-center">
      <div
        class="projectMsg"
        v-if="isShowMsg"
        :style="{
          left: currentProjectMsg.left + 'px',
          top: currentProjectMsg.top + 'px'
        }"
      >
        <div class="lineMsg">
          <span class="projectName">{{ currentProjectMsg.name }}</span>
        </div>
        <div class="lineMsg">
          <span class="title">持续时间:</span><span>{{ currentProjectMsg.allTime }}天</span>
        </div>
        <div class="lineMsg">
          <span class="title">当前进度:</span><span>{{ currentProjectMsg.per }}%</span>
        </div>
        <div class="lineMsg">
          <span class="title">开始时间:</span><span>{{ currentProjectMsg.startTime }}</span>
        </div>

        <div class="lineMsg">
          <span class="title">结束时间:</span><span>{{ currentProjectMsg.endTime }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import seriesLine from './series-line.vue'
import slider from './silder.vue'
export default {
  name: 'gantt-body',

  components: {
    slider,
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
    currentDaySize: {
      type: Object,
      default: () => {
        return {
          label: '天',
          value: 40
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
      // 是否显示信息
      isShowMsg: false,
      // 当前hover的项目信息
      currentProjectMsg: {
        name: '',
        allTime: 0,
        per: 0,
        startTime: 0,
        endTime: 0,
        left: 0,
        top: 0
      },
      hoverId: '',
      // 背景高度
      lineBGHeight: '0px'
      // line: [
      //   { startX: 17320, startY: 60, endX: 17080, endY: 100 },
      //   { startX: 17320, startY: 100, endX: 17480, endY: 140 },
      //   { startX: 17320, startY: 220, endX: 17480, endY: 180 },
      //   { startX: 17480, startY: 260, endX: 17320, endY: 220 }
      // ]
    }
  },

  computed: {
    computedLine () {
      const arr = []
      const showLine = this.computedList.length && this.line.length
      showLine && this.line.forEach((item) => {
        const start = this.computedList.find((i) => i.id === item.sourceid)
        const end = this.computedList.find((i) => i.id === item.targetid)
        arr.push({
          id: item.id,
          startX: start.left + start.widthMe,
          startY: start.top + 14,
          endX: end.left,
          endY: end.top + 14
        })
      })
      return arr
    },
    computedList () {
      let arr = []
      this.list.forEach((item) => {
        if (!item.children || item.children.length < 1) {
          arr.push(item)
        } else if (item.children && item.children.length >= 1) {
          arr.push(item)
          arr = arr.concat(item.children)
        }
      })
      return arr
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

  watch: {},

  mounted () {
    this.setStoneLine()
  },

  methods: {
    // 设置里程碑线的高度
    setStoneLine (isFirst) {
      this.$nextTick(() => {
        const height = getComputedStyle(document.querySelector('.lineBG')).height
        this.lineBGHeight = height
      })
    },
    // 每一行拖拽
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    lineMousedown (dom, e, id, parentId, index) {
      const line = this.$refs[dom][0]
      const initX = e.pageX
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      let result
      let z = 0
      let left
      // console.log(cp);
      document.onmousemove = (event) => {
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        const clientWidth = ganttBlock.width
        // event.pageX - ganttBlock.left 鼠标距离 gantt-right 左侧位置
        if (event.pageX - ganttBlock.left >= clientWidth - 40) {
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
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
      }
      document.onmouseup = (events) => {
        if (!result) {
          document.onmousemove = document.onmouseup = null
          return
        }
        left = Math.round(result / this.currentDaySize.value) * this.currentDaySize.value
        this.computedList[index].left = left
        line.style.left = left + 'px'
        this.checkIsin(dom, events, id, parentId, index)
        if (parentId) {
          this.list.forEach((item) => {
            if (item.id === parentId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.left = left
                }
              })
            }
          })
          this.setGroupWidth(parentId)
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.left = left
            }
          })
        }
        document.onmousemove = document.onmouseup = null
      }
    },
    changeTime (dom, e, id, parentId, index) {
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
        endTime: this.computedWithTime(end - this.currentDaySize.value, true)
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
     */
    // 鼠标悬停展示上部日期
    lineMouseover (dom, e, id, parentId, index) {
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
      this.lineMouseenter(dom, e, id, parentId, index)
    },
    // 鼠标离开信息消失，时间显示消失
    /**
     * @param  {Object} e $event
     * @param  {Boolean} move 是否移动状态
     */
    lineMouseleave (e, move) {
      if (move) {
        this.isShowMsg = false
        this.currentProjectMsg = {
          name: '',
          allTime: 0,
          per: 0,
          startTime: 0,
          endTime: 0,
          left: 0,
          top: 0
        }
        // this.handlerSelect();
        return
      }

      const currentLineDay = {
        start: 0,
        end: 0
      }
      this.$emit('currentLineDayInit', currentLineDay)
      this.$emit('update:isHover', false)
      this.isShowMsg = false
      this.currentProjectMsg = {
        name: '',
        allTime: 0,
        per: 0,
        startTime: 0,
        endTime: 0,
        left: 0,
        top: 0
      }
      this.hoverId = ''
      this.handlerSelect()
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    // 鼠标进入显示当前项目的基本信息框
    lineMouseenter (dom, e, id, parentId, index) {
      this.hoverId = id
      const start =
        Math.round(parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value) *
        this.currentDaySize.value
      let end = parseInt(this.$refs[dom][0].style.left) + parseInt(this.$refs[dom][0].style.width)
      end =
        Math.round(end / this.currentDaySize.value) * this.currentDaySize.value -
        this.currentDaySize.value
      this.currentProjectMsg = {
        name: this.computedList[index].name,
        allTime: (end - start) / this.currentDaySize.value + 1,
        per: this.computedList[index].per,
        startTime: this.computedWithTime(start),
        endTime: this.computedWithTime(end),
        left:
          e.pageX + 220 >=
          document.querySelector('.gantt-right').getBoundingClientRect().width + this.leftWidth
            ? e.pageX - 220
            : e.pageX,
        top: e.y
      }
      console.log(e.pageX)
      console.log(e.y)
      this.isShowMsg = true
    },
    // 里程碑去掉mouseenter显示
    stoneLineMouseenter () {
      this.isShowMsg = false
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
    checkIsin (dom, events, id, parentId, index) {
      const line = this.$refs[dom][0] // 目标silder
      // const lineTop = parseInt(line.style.top)
      // const lineDown = lineTop + 16
      // const lineLeft = parseInt(line.style.left)
      // const lineRight = parseInt(this.computedList[index].widthMe) + lineLeft
      const targetElement = events.target || events.srcElement // 鼠标最后的元素
      if (line.contains(targetElement)) {
        this.lineMouseover(dom, events, id, parentId, index)
        this.lineMouseenter(dom, events, id, parentId, index)
      } else {
        this.isShowMsg = false
        const currentLineDay = {
          start: 0,
          end: 0
        }
        this.$emit('currentLineDayInit', currentLineDay)
      }
      this.changeTime(dom, events, id, parentId, index)
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
    // 设置左侧leftmenu高亮
    handlerSelect (row) {
      // console.log('handlerSelect', row)
    },
    // 左侧拖拽增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    leftCurDragMounsedown (dom, e, id, parentId, index) {
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      const line = this.$refs[dom][0]
      const cx = e.pageX
      let result
      let result1
      let z = 0
      let addwidth
      document.onmousemove = (event) => {
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        if (event.pageX - ganttBlock.left <= 40) {
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
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
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
        this.checkIsin(dom, events, id, parentId, index)
        // this.setComputedListGroupWidth(parentId);
        if (parentId) {
          this.list.forEach((item) => {
            if (item.id === parentId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.widthMe = k.widthChild = result
                  k.left = result1
                }
              })
            }
          })
          this.setGroupWidth(parentId)
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.widthMe = item.widthChild = result
              item.left = result1
            }
          })
        }
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
    rightCurDragMounsedown (dom, e, id, parentId, index) {
      const initScrollX = document.querySelector('.gantt-right').scrollLeft
      const ganttBlock = document.querySelector('.gantt-right').getBoundingClientRect()
      const line = this.$refs[dom][0]
      const cx = e.pageX
      let result
      let z = 0
      let addwidth
      document.onmousemove = (event) => {
        const scrollX = document.querySelector('.gantt-right').scrollLeft
        const clientWidth = ganttBlock.width
        if (event.pageX - ganttBlock.left >= clientWidth - 40) {
          z = scrollX + this.currentDaySize.value
          document.querySelector('.gantt-right').scrollTo({
            top: 0,
            left: z,
            behavior: 'smooth'
          })
          addwidth = event.pageX - cx + scrollX - initScrollX
        } else if (event.pageX - ganttBlock.left <= 40) {
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
        this.lineMouseover(dom, e, id, parentId, index)
        this.lineMouseleave(e, true)
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
        this.checkIsin(dom, events, id, parentId, index)
        if (parentId) {
          this.list.forEach((item) => {
            if (item.id === parentId) {
              item.children.forEach((k) => {
                if (k.id === id) {
                  k.widthMe = k.widthChild = result
                  // k.left = result1;
                }
              })
            }
          })
          this.setGroupWidth(parentId)
        } else {
          this.list.forEach((item) => {
            if (item.id === id) {
              item.widthMe = item.widthChild = result
              // item.left = result1;
            }
          })
        }
        document.onmousemove = document.onmouseup = null
      }
    },
    dynmicStyle (data) {
      const { startX, startY, endX, endY } = data
      const orignX = Math.min(startX, endX)
      const orignY = Math.min(startY, endY)
      let overflowWidth = 0
      let overflowHeight = 0
      if (startX >= endX) {
        overflowWidth = 20
      }
      if (startY > endY) {
        overflowHeight = 2
      }
      return {
        left: orignX - overflowWidth + 'px',
        top: orignY - overflowHeight + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.gantt-body {
  height: 100%;
  .row-line {
    border-bottom: 1px solid #EBEEF5;
    width:100%;
    position: absolute;
  }
  .lineBG {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    .first {
      position: absolute;
      left: 0;
      top: 0;
      width: 15px;
      height: 2px;
      background-color: black;
    }
    .seconed {

    }
    .line {
      position: absolute;
      .rightCurDrag {
        cursor: e-resize;
        width: 10px;
        border: 1px solid #e5e6eb;
        background-color: #ffffff;
        height: 26px;
        position: absolute;
        right: 0px;
        transform: translateY(-50%);
        top: 50%;
        border-radius: 3px;
        user-select: none;
      }
      .leftCurDrag {
        cursor: e-resize;
        width: 10px;
        border: 1px solid #e5e6eb;
        background-color: #ffffff;
        height: 26px !important;
        position: absolute;
        left: 0px;
        transform: translateY(-50%);
        top: 50%;
        border-radius: 3px;
        user-select: none;
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
    .group {
      position: absolute;
      background-color: #C1E8FF !important;
      border: none !important;
      border-radius: 0 !important;
      height: 18px !important;
      line-height: 18px !important;
      clip-path: polygon(
        100% 0,
        100% 100%,
        calc(100% - 8px) 60%,
        8px 60%,
        0 100%,
        0 0
      );
      // > div {
      //   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      // }
      .progress {
        // width: 50px;
        background-color: #74C3FF !important;
        height: 100%;
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
