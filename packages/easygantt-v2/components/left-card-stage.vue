<template>
  <div class="left-card-stage">
    <div>
      <i
        v-if="item.expand"
        class="el-icon-caret-bottom operator-icon"
        @click="expandData(false)"
      ></i>
      <i v-else class="el-icon-caret-top operator-icon" @click="expandData(true)"></i>
      <span>{{ item.name }}</span>
    </div>
    <div class="head-operate">
      <i class="el-icon-plus operator-icon" @click="newTask(item)"></i>
      <el-popover placement="bottom" trigger="click" width="154" v-model="showMore">
        <div>
          <div @click="editStageAfterCur(item)">编辑</div>
          <div @click="addStageAfterCur(item)">在此之后添加阶段</div>
          <div @click="deleteStage(item)">删除</div>
        </div>
        <i
          slot="reference"
          class="el-icon-more operator-icon"
          @click="moreOperator(item)"
        ></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'left-card-stage',
  props: {
    item: {
      type: Object,
      required: true
    },
    curIndex: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      showMore: false
    }
  },

  methods: {
    expandData (state) {
      this.$emit('expandData', this.curIndex, state)
    },
    newTask (item) {
      this.$emit('newTask', item)
    },
    editStageAfterCur (item) {
      this.$emit('editStageAfterCur', item)
      this.showMore = false
    },
    addStageAfterCur (item) {
      this.$emit('addStageAfterCur', item)
      this.showMore = false
    },
    deleteStage (item) {
      this.$emit('deleteStage', item)
    },
    moreOperator (item) {
      this.$emit('moreOperator', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .left-card-stage {
    color: rgba(50, 50, 51, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Medium;
    display: flex;
    justify-content: space-between;
    height: 20px;
    display: flex;
    align-items: center;
    padding: 10px 8px;
    .head-operate {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .operator-icon {
      cursor: pointer;
      color: #C9CDD4;
    }
  }
</style>
