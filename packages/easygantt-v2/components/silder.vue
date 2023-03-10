<template>
  <div class="slider" ref="slider">
    <div class="process" :style="{ width }" :class="{ finish: this.per === 100 }"></div>
  </div>
</template>

<script>
export default {
  name: 'silder',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: ['min', 'max', 'value', 'widths', 'id', 'parentId'],

  data () {
    return {
      // 滚动条DOM元素
      slider: null,
      // 当前值
      per: this.value,
      // 当前是否拖拽tip
      isMove: false
    }
  },

  computed: {
    scale () {
      return (this.per - this.min) / (this.max - this.min)
    },
    width () {
      if (this.slider) {
        return this.widths * this.scale + 'px'
      } else {
        return 0 + 'px'
      }
    },
    left () {
      if (this.slider) {
        return this.widths * this.scale - this.thunk.offsetWidth / 2 + 'px'
      } else {
        return 0 + 'px'
      }
    }
  },

  watch: {
  },

  mounted () {
    this.slider = this.$refs.slider
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.slider {
  position: relative;
  height: 28px;
  background: #C1E8FF;
  border-radius: 3px;
  cursor: move;
  user-select: none;
  width: 100%;
  .process {
    position: absolute;
    left: 0;
    top: 0;
    width: 112px;
    height: 28px;
    border-radius: 3px;
    background: #74C3FF;
  }
  .finish {
    background: #B2F5C0;
  }
}
</style>
