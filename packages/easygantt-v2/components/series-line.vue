<template>
  <div
    class="series-line"
    :style="dynmicStyle">
    <svg
      :width="width"
      :height="height"
      :ref="'svg' + pointData.id"
      @mouseenter="svgMouseEnter"
      @mouseleave="svgMouseLeave">
      <!-- <line :x1="startX" :y1="startY" :x2="midPoint1.x" :y2="midPoint1.y" class="line" />
      <line :x1="midPoint1.x" :y1="midPoint1.y" :x2="midPoint2.x" :y2="midPoint2.y" class="line" />
      <line :x1="midPoint2.x" :y1="midPoint2.y" :x2="midPoint3.x" :y2="midPoint3.y" class="line" />
      <line :x1="midPoint3.x" :y1="midPoint3.y" :x2="midPoint4.x" :y2="midPoint4.y" class="line" />
      <line :x1="midPoint4.x" :y1="midPoint4.y" :x2="endX" :y2="endY" class="line" /> -->
      <defs>
        <marker :id="'arrow-line'+pointData.id" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" class="svg-marker-line" :class="{isHover: isHover}" />
        </marker>
      </defs>
      <!-- 改用折线直接绘制 便于触发鼠标事件 -->
      <polyline
        :ref="'polyline' + pointData.id"
        :points="points" class="poly-line"
        :marker-end="getMarkend"
        @mouseenter="polylineMouseEnter"
        @mouseleave="polylineMouseLevel"
        @click="showDel"/>
    </svg>
    <i
      class="el-icon-delete line-icon"
      :style="iconStyle"
      @mouseenter="iconMouseEnter"
      @mouseleave="iconMouseLeave"
      v-show="isShowDel"></i>
  </div>
</template>

<script>
export default {
  name: 'series-line',
  data () {
    return {
      isShowDel: false,
      isHover: false,
      icon: false
    }
  },
  props: {
    pointData: {
      type: Object,
      default: () => ({})
    },
    currentDaySize: {
      type: Object,
      default: () => {
        return {
          label: '天',
          value: 60
        }
      }
    }
  },
  computed: {
    getMarkend () {
      const id = this.pointData.id
      return `url(#arrow-line${id})`
    },
    polylineStaticWidth () {
      return this.currentDaySize.value / 2
    },
    dynmicStyle () {
      const { startX, startY, endX, endY } = this.pointData
      const orignX = Math.min(startX, endX)
      const orignY = Math.min(startY, endY)
      let overflowWidth = 0
      let overflowHeight = 0
      if (startX >= endX) {
        // overflowWidth = 20
        overflowWidth = this.polylineStaticWidth
      }
      if (startY > endY) {
        overflowHeight = 8
      }
      return {
        left: orignX - overflowWidth + 'px',
        top: orignY - overflowHeight + 'px'
      }
    },
    iconStyle () {
      const { startX, endX } = this.pointData
      let left = this.currentDaySize.value / 2 + 5 + 'px'
      if (startX >= endX) {
        left = this.startX + this.currentDaySize.value / 2 + 5 + 'px'
      }
      return {
        left: left
      }
    },
    // 连线元素 左上角坐标
    leftTopPoint () {
      const { startX, startY, endX, endY } = this.pointData
      let x = Math.min(startX, endX)
      let y = Math.min(startY, endY)
      if (startX >= endX) { // 当连接目标在左侧
        // x = x - 20 - 2 // 连线模块元素需要往左扩大20像素 2表示线框，目地是让线展示更清楚
        x = x - this.polylineStaticWidth - 2 // 连线模块元素需要往左扩大20像素 2表示线框，目地是让线展示更清楚
      }
      if (startY > endY) {
        y = y + 0
      }
      return {
        x: x,
        y: y
      }
    },
    // 连续元素 右下角角坐标
    rightEndPoint () {
      const { startX, startY, endX, endY } = this.pointData
      let x = Math.max(startX, endX)
      const y = Math.max(startY, endY)
      if (startX >= endX) { // 当连接目标在左侧
        // x = x + 20 + 2// 连线模块元素需要往右扩大20像素 2表示线框，目地是让线展示更清楚
        x = x + this.polylineStaticWidth + 2// 连线模块元素需要往右扩大20像素 2表示线框，目地是让线展示更清楚
      }
      return {
        x: x,
        y: y
      }
    },
    // 开始x坐标
    startX () {
      const { startX, endX } = this.pointData
      let x = startX - this.leftTopPoint.x
      if (startX >= endX) {
        // x = startX - endX + 20
        x = startX - endX + this.polylineStaticWidth
      }
      return x
    },
    // 开始y坐标
    startY () {
      const { startY, endY } = this.pointData
      let y = startY - this.leftTopPoint.y + 2
      if (startY > endY) {
        y = startY - this.leftTopPoint.y + 10
      }
      return y
    },
    // 结束x坐标
    endX () {
      const { endX } = this.pointData
      return endX - this.leftTopPoint.x
    },
    // 结束y坐标
    endY () {
      const { startY, endY } = this.pointData
      let y = endY - this.leftTopPoint.y - 2
      if (startY > endY) {
        y = endY - this.leftTopPoint.y + 6
      }
      return y
    },
    // 连线设计了4个转折点 第一个节点，默认往右20像素
    midPoint1 () {
      return {
        // x: this.startX + 20,
        x: this.startX + this.polylineStaticWidth,
        y: this.startY
      }
    },
    // 连线设计了4个转折点 第二个节点 默认x为 第一节点x
    midPoint2 () {
      const { startY, endY } = this.pointData
      let y = this.midPoint1.y + 20 // 默认y 为向下20像素
      if (startY > endY) { // 当目标在上方
        y = this.midPoint1.y - 20 // y为向上20像素
      }
      return {
        x: this.midPoint1.x,
        y: y
      }
    },
    // 连线设计了4个转折点 第三个节点 默认x为 第一节点x；y为目标y
    midPoint3 () {
      const { startX, endX } = this.pointData
      let x = this.midPoint1.x
      let y = this.endY
      if (startX >= endX) { // 当目标位于左侧
        // x = this.endX - 20 // x为目标位置往左20像素
        x = this.endX - this.polylineStaticWidth // x为目标位置往左20像素
        y = this.midPoint2.y // y为第2节点的y
      }
      return {
        x: x,
        y: y
      }
    },
    // 连线设计了4个转折点 第四个节点 默认x为目标节点往左20像素，y为目标节点
    midPoint4 () {
      return {
        // x: this.endX - 20,
        x: this.endX - this.polylineStaticWidth,
        y: this.endY
      }
    },
    // 连线元素块的宽
    width () {
      const { startX, endX } = this.pointData
      let width = this.rightEndPoint.x - this.leftTopPoint.x
      if (startX >= endX) { // 当目标点在左侧，左右都扩了20，宽度需要加40
        // width = startX - endX + 40 + 2
        width = startX - endX + this.currentDaySize.value + 2
      }
      return width
    },
    // 连线元素块的高
    height () {
      return this.rightEndPoint.y - this.leftTopPoint.y + 2 + 2 + 8
    },
    points () {
      return `
      ${this.startX},${this.startY}
      ${this.midPoint1.x},${this.midPoint1.y}
      ${this.midPoint2.x},${this.midPoint2.y}
      ${this.midPoint3.x},${this.midPoint3.y}
      ${this.midPoint4.x},${this.midPoint4.y}
      ${this.endX},${this.endY}`
    }
  },

  mounted () {
  },
  methods: {
    mouseenter (e) {
      console.log(e)
    },
    showDel () {
      this.isShowDel = true
    },
    polylineMouseEnter () {
      this.$el.style.zIndex = 1
      this.isHover = true
    },
    polylineMouseLevel () {
      this.isHover = false
    },
    svgMouseEnter (e) {
      console.log(e)
      // this.isShowDel = false
    },
    svgMouseLeave (e) {
      this.$el.style.zIndex = ''
      setTimeout(() => {
        if (!this.icon) {
          this.isShowDel = false
        }
      }, 1000)
    },
    iconMouseEnter () {
      this.icon = true
    },
    iconMouseLeave () {
      this.icon = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.series-line {
  position: absolute;
  .line {
    stroke: #C9CDD4;
    stroke-width:2
  }
  .line-icon {
    position: absolute;
  }
  .poly-line {
    fill: none;
    stroke: #C9CDD4;
    stroke-width: 2
  }
  .svg-marker-line {
    fill: #C9CDD4;
  }
  .isHover {
    fill: #4DACFF;
  }
  .poly-line:hover {
    fill: none;
    stroke: #4DACFF;
    stroke-width: 2
    cursor: pointer;
  }
}
</style>
