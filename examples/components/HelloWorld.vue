<template>
  <div>
    <svg :width="width" :height="height">
      <line :x1="startX" :y1="startY" :x2="midX" :y2="startY" stroke="black" stroke-width="2" />
      <line :x1="midX" :y1="startY" :x2="midX" :y2="endY" stroke="black" stroke-width="2" />
      <line :x1="midX" :y1="endY" :x2="endX" :y2="endY" stroke="black" stroke-width="2" />
    </svg>
  <svg width="100" height="100">
    <line x1="0" y1="50" x2="100" y2="50" stroke-dasharray="5" stroke="black" />
  </svg>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startX: 200,
      startY: 200,
      endX: 100,
      endY: 300
    }
  },
  computed: {
    width () {
      return Math.abs(this.endX - this.startX)
    },
    height () {
      return Math.abs(this.endY - this.startY)
    },
    midX () {
      return Math.abs(this.endX - this.startX) / 2 + Math.min(this.startX, this.endX)
    }
  }
}
</script>
<style>

</style>
