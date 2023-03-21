<template>
  <div class="left-card">
    <div v-for="item in list" :key="item.id">
      <div class="left-card__head line-height">
        <div>
          <i class="el-icon-caret-bottom" v-if="item.expand" @click="item.expand = !item.expand"></i>
          <i class="el-icon-caret-top" v-else @click="item.expand = !item.expand"></i>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <i class="el-icon-plus" @click="newTask(item)"></i>
        </div>
      </div>
      <template v-if="item.children && item.children.length">
        <div class="left-card__body" v-show="item.expand">
          <div v-for="child in item.children" :key="child.id" class="line-height">
            {{ child.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'left-card',

  mixins: [],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    const leftCard = document.querySelector('.left-card')
    const lineBG = document.querySelector('.lineBG')
    let leftCardchange = true
    let lineBGchange = true
    leftCard.onscroll = () => {
      if (leftCardchange) {
        lineBG.scrollTop = leftCard.scrollTop / (leftCard.scrollHeight - leftCard.clientHeight) * (lineBG.scrollHeight - lineBG.clientHeight)
        lineBGchange = false
      } else {
        leftCardchange = true
      }
    }
    lineBG.onscroll = () => {
      if (lineBGchange) {
        leftCard.scrollTop = lineBG.scrollTop / (lineBG.scrollHeight - lineBG.clientHeight) * (leftCard.scrollHeight - leftCard.clientHeight)
        leftCardchange = false
      } else {
        lineBGchange = true
      }
    }
  },
  methods: {
    newTask (item) {
      this.$emit('handlerNewTask', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-card {
  flex: 1;
  overflow-y: scroll;
  width: 100%;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  .left-card__head {
    color: rgba(50, 50, 51, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Medium;
    display: flex;
    justify-content: space-between;
  }
  .left-card__body {
    line-height: 20px;
    color: rgba(100, 101, 102, 1);
    font-size: 12px;
    text-align: left;
    font-family: PingFangSC-Regular;
  }
}
.line-height {
  height: 19px;
  border-bottom: 1px solid #EBEEF5;
  display: flex;
  align-items: center;
  padding: 10px 8px;
}
</style>
