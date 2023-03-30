<template>
  <div>
    <div class="border-line" :style="setStyle(item.top, item.leftShow, item.widthMeShow + 1)">
      <svg class="border-line__svg">
        <!-- 改用折线直接绘制 便于触发鼠标事件 -->
        <polyline :points="points" class="poly-line" stroke-dasharray="5,5" />
      </svg>
    </div>

    <div
      class="group-dynmic-line"
      :ref="'groupdynmicline' + item.id"
      v-show="item.expand"
      :style="setStyle(item.top, item.leftShow, item.widthMeShow)"
    >
    </div>
    <div
      class="group-line"
      :ref="'groupline' + item.id"
      :style="setStyle(item.top, item.left, item.widthMe)"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: 'group',

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    points () {
      const { leftShow, widthMeShow, left, widthMe } = this.item
      const right = left + widthMe
      const rightShow = leftShow + widthMeShow
      const point1 = '1,1'
      const point2 = `${widthMeShow - 1},1`
      let point3 = `${widthMeShow - 1},18`
      const point4 = `${widthMeShow - 8},10`
      const point5 = '8,10'
      let point6 = '1,18'
      const point7 = point1
      if (leftShow >= left && rightShow <= right) {
        // 动态块在父时间内
        point3 = `${widthMeShow - 1},10`
        point6 = '1,10'
      } else if (leftShow > left && leftShow < right && rightShow > right) {
        // 动态块的右侧在父外 左侧在父内
        point6 = '1,10'
      } else if (rightShow < right && rightShow > left && leftShow < left) {
        // 动态块的左侧在父外 右侧在父内
        point3 = `${widthMeShow - 1},10`
      }
      return `
        ${point1}
        ${point2}
        ${point3}
        ${point4}
        ${point5}
        ${point6}
        ${point7}
      `
    }
  },
  updated () {
    this.setLineStyle()
    // console.log(groupLine)
  },
  mounted () {
    this.setLineStyle()
  },

  methods: {
    setStyle (top, left, width) {
      return {
        top: top + 'px',
        left: left + 'px',
        width: width + 'px'
      }
    },
    setLineStyle () {
      const groupLine = this.$refs[`groupline${this.item.id}`]
      const groupDynmicLine = this.$refs[`groupdynmicline${this.item.id}`]
      const { leftShow, widthMeShow, left, widthMe } = this.item
      const right = left + widthMe
      const rightShow = leftShow + widthMeShow
      // if (this.item.name === '第二层2') debugger
      if (leftShow >= left && rightShow <= right) {
        // console.log('动态块在父时间内', this.item.name)
        // 动态块在父时间内
        groupDynmicLine.style.clipPath = 'polygon(100% 0, 100% 60%, calc(100% - 8px) 60%, 8px 60%, 0 60%,0 0)'
        groupLine.style.clipPath = 'polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 100%,0 0)'
      } else if (leftShow >= left && leftShow < right && rightShow > right) {
        // console.log('动态块的右侧在父外 左侧在父内', this.item.name)
        // 动态块的右侧在父外 左侧在父内
        groupDynmicLine.style.clipPath = 'polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 60%,0 0)'
        groupLine.style.clipPath = 'polygon(100% 0, 100% 60%, calc(100% - 8px) 60%, 8px 60%, 0 100%,0 0)'
      } else if (rightShow <= right && rightShow > left && leftShow < left) {
        // console.log('动态块的左侧在父外 右侧在父内', this.item.name)
        // 动态块的左侧在父外 右侧在父内
        groupDynmicLine.style.clipPath = 'polygon(100% 0, 100% 60%, calc(100% - 8px) 60%, 8px 60%, 0 100%,0 0)'
        groupLine.style.clipPath = 'polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 60%,0 0)'
      } else if (leftShow >= right || rightShow <= left) {
        // 动态块在父外
        groupLine.style.clipPath = 'polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 100%,0 0)'
      } else if (leftShow < left && rightShow > right) {
        // 动态块包住父
        groupLine.style.clipPath = 'polygon(100% 0, 100% 60%, calc(100% - 8px) 60%, 8px 60%, 0 60%,0 0)'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .border-line {
    position: absolute;
    height: 18px;
    z-index: 1;
    .border-line__svg {
      height: 100%;
      width: 100%
    }
  }
  .poly-line {
    fill: none;
    stroke: #FFD36D;
    stroke-width: 1;
  }
.group-line {
  position: absolute;
  z-index: 2;
  background-color: #74C3FF;
  border: none;
  border-radius: 0;
  height: 18px;
  line-height: 18px;
  clip-path: polygon(
    100% 0,
    100% 100%,
    calc(100% - 8px) 60%,
    8px 60%,
    0 100%,
    0 0
  );
}
.group-dynmic-line {
  position: absolute;
  background-color: #FFFBE8;
  border: none;
  border-radius: 0;
  height: 18px;
  line-height: 18px;
  clip-path: polygon(
    100% 0,
    100% 100%,
    calc(100% - 8px) 60%,
    8px 60%,
    0 100%,
    0 0
  );
}
</style>
