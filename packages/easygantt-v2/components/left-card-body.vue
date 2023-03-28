<template>
  <div class="left-card-body" @mouseenter="showMoreBlock = true" @mouseleave="handlerMouseLeave">
    <div class="icon-block" :style="{ width: iconWidth }">
      <i
        v-if="child.expand && child.hasChildren"
        class="el-icon-caret-bottom operator-icon"
        @click="expandTaskData(!child.expand)"
      ></i>
      <i v-else-if="!child.expand && child.hasChildren" class="el-icon-caret-top operator-icon" @click="expandTaskData(!child.expand)"></i>
      <i class="el-icon-s-flag"></i>
    </div>
    <div class="name-block">{{ child.name }}</div>
    <div class="operator-block">
      <el-popover v-if="showMoreBlock" placement="bottom" trigger="click" width="154" v-model="showMore">
        <div>
          <div
            class="operator-option"
            v-for="option in options"
            :key="option.type"
            @click="dispatchFunction(option)">
            {{ option.name }}
          </div>
        </div>
        <div
          class="more-icon"
          slot="reference">
          <i
            class="el-icon-more"
            @click="moreOperator(child)"
          ></i>
        </div>
      </el-popover>
      <img class="operator-block_img" src="https://static-legacy.dingtalk.com/media/lADPM5VwD_Gfzz7NBXDNBXA_1392_1392.jpg_100x100.jpg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'left-card-body',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
    child: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      showMoreBlock: false,
      showMore: false,
      options: [
        { type: 1, name: '设置负责人' },
        { type: 2, name: '转换为里程碑' },
        { type: 3, name: '新建工单' },
        { type: 4, name: '修改截止时间' },
        { type: 5, name: '关联父任务' },
        { type: 6, name: '取消任务' }
      ]
    }
  },

  computed: {
    iconWidth () {
      let width = '30px'
      const { level } = this.child
      switch (level) {
        case 1:
          width = '30px'
          break
        case 2:
          width = '51px'
          break
        case 3:
          width = '72px'
          break

        default:
          break
      }
      return width
    }
  },

  watch: {
    showMore (val) {
      if (!val) {
        this.showMoreBlock = val
      }
    }
  },

  mounted () {
  },

  methods: {
    expandTaskData (state) {
      this.$emit('expandTaskData', this.child, state)
    },
    dispatchFunction (option) {
      this.showMore = false
      this.showMoreBlock = false
      this.$emit('handlerOperateChild', option.type, this.child)
    },
    moreOperator (item) {
      console.log(item)
    },
    handlerMouseLeave () {
      if (!this.showMore) {
        this.showMoreBlock = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-card-body {
  height: 19px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  align-items: center;
  padding: 10px 8px;
  .icon-block {
    flex: none;
    display: flex;
    justify-content: flex-end;
    padding: 0 9px;

    .operator-icon {
      cursor: pointer;
      color: #C9CDD4;
      margin-right: 5px;
    }
  }
  .name-block {
    flex: 1;
    line-height: 20px;
    color: rgba(100, 101, 102, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Regular;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .operator-block {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center
    .operator-block_img {
      height: 20px;
      width: 20px;
      border-radius: 4px;
    }
    .more-icon {
      cursor: pointer;
      margin-right: 8px;
      height: 16px;
      width: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C9CDD4;
    }
    .more-icon:hover {
      background-color: #FFF5E8;
      color: #FF8C2E;
    }
  }
}
</style>
<style>
.operator-option {
  cursor: pointer;
  line-height: 32px;
  color: rgba(100, 101, 102, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
</style>
