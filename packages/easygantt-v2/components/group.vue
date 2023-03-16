<template>
  <div>
    <div
      class="group-dynmic"
      :style="setStyle(item.top, item.left, item.widthMe)"
    >
    </div>
    <div
      class="group"
      :style="setStyle(item.top, item.leftStatic, item.widthMeStatic)"
    >
      <div class="progress" :style="{ width: item.per + '%' }"></div>
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

  methods: {
    setStyle (top, left, width) {
      return {
        top: top + 'px',
        left: left + 'px',
        width: width + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.group {
  position: absolute;
  background-color: #C1E8FF;
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
  .progress {
    background-color: #74C3FF;
    height: 100%;
  }
}
.group-dynmic {
  position: absolute;
  background-color: #FFFBE8;
  border: none;
  border-radius: 0;
  height: 10px;
  line-height: 18px;
  border: 1px dashed #FFD36D;
  box-sizing: border-box;
}
</style>
