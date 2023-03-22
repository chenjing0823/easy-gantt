<template>
  <div class="left-card">
    <template v-for="(item, index) in list">
      <div class="card-block" :key="item.id">
        <div class="left-card__head head-height">
          <div>
            <i class="el-icon-caret-bottom operator-icon" v-if="item.expand" @click="expandData(index, false)"></i>
            <i class="el-icon-caret-top operator-icon" v-else @click="expandData(index, true)"></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="head-operate">
            <i class="el-icon-plus operator-icon" @click="newTask(item)"></i>
            <el-popover
              placement="bottom"
              width="154"
              trigger="click">
              <div>
                <div>编辑</div>
                <div @click="addStageAfterCur(item)">在此之后添加阶段</div>
                <div @click="deleteStage(item)">删除</div>
              </div>
              <i class="el-icon-more operator-icon" @click="moreOperator(item)" slot="reference"></i>
            </el-popover>
          </div>
        </div>
        <template v-if="item.children && item.children.length">
          <div class="left-card__body" v-show="item.expand">
            <div v-for="child in item.children" :key="child.id" class="left-card__body-height">
              {{ child.name }}
            </div>
          </div>
        </template>
      </div>
      <new-stage
        v-if="curData.id === item.id"
        :clickData="curData"
        type="special"
        :item="item"
        class="card-block"
        :key="item.id + 'newstage'"
        @handlerNewStage="handlerNewStage"
        @initClickData="initClickData"
        :isNew.sync="isNew" ></new-stage>
    </template>
    <new-stage class="card-block" @handlerNewStage="handlerNewStage" :isNew.sync="isNew" ></new-stage>
  </div>
</template>

<script>

import NewStage from './new-stage.vue'
export default {
  name: 'left-card',

  components: {
    NewStage
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isNew: false,
      curData: {}
    }
  },
  mounted () {
    const leftCard = document.querySelector('.left-card')
    const lineBG = document.querySelector('.lineBG')
    let leftCardchange = true
    let lineBGchange = true
    leftCard.onscroll = () => {
      if (leftCardchange) {
        console.log(leftCard.clientHeight)
        console.log(lineBG.clientHeight)
        lineBG.scrollTop = leftCard.scrollTop / (leftCard.scrollHeight - leftCard.clientHeight) * (lineBG.scrollHeight - lineBG.clientHeight)
        lineBGchange = false
      } else {
        leftCardchange = true
      }
      this.init()
    }
    lineBG.onscroll = () => {
      if (lineBGchange) {
        leftCard.scrollTop = lineBG.scrollTop / (lineBG.scrollHeight - lineBG.clientHeight) * (leftCard.scrollHeight - leftCard.clientHeight)
        leftCardchange = false
      } else {
        lineBGchange = true
      }
      this.init()
    }
  },
  methods: {
    newTask (item) {
      this.$emit('handlerNewTask', item)
    },
    handlerNewStage (data, clickData, callback) {
      if (clickData.id) {
        const index = this.list.findIndex(item => item.id === clickData.id) + 1
        this.$emit('handlerNewStage', data, index, callback)
      } else {
        this.$emit('handlerNewStage', data, '', callback)
      }
    },
    initClickData () {
      this.curData = {}
    },
    addStageAfterCur (item) {
      this.curData = item
    },
    deleteStage (data) {
      const index = this.list.findIndex(item => item.id === data.id)
      this.$emit('handlerDeleStage', index)
    },
    init () {
      this.curData = {}
      this.isNew = false
    },
    /**
     * @description: 收起项目
     * @param {Number} 目标项目阶段所在数组下标
     * @param {Boolean} 设置状态 false收起 true展开
     */
    expandData (index, state) {
      /**
       * @description: 由于可能有3级任务，递归处理更方便
       * @param {Object} 当前层级数据
       * @param {Boolean} [isChild] 当前层级数据是否为子项
       */
      const setExpand = (data, isChild = false) => {
        data.expand = state
        if (isChild) {
          data.isShow = state
        }
        if (data.children && data.children.length) {
          data.children.forEach((child) => {
            setExpand(child, true)
          })
        }
      }
      setExpand(this.list[index])
    },
    moreOperator (item) {
      console.log(item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-card {
  position: relative;
  flex: 1;
  overflow-y: scroll;
  width: 100%;
  border-radius: 4px;
  background-color: #F7F8FA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  .card-block {
    background-color: #ffffff;
    margin-bottom: 5px;
    border-radius: 5px;
  }
  .left-card__head {
    color: rgba(50, 50, 51, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Medium;
    display: flex;
    justify-content: space-between;
    .head-operate {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .operator-icon {
      cursor: pointer;
    }
  }
  .head-height {
    height: 20px;
    display: flex;
    align-items: center;
    padding: 10px 8px;
  }
  .left-card__body {
    line-height: 20px;
    color: rgba(100, 101, 102, 1);
    font-size: 12px;
    text-align: left;
    font-family: PingFangSC-Regular;
    .left-card__body-height {
      height: 19px;
      border-top: 1px solid #EBEEF5;
      display: flex;
      align-items: center;
      padding: 10px 8px;
    }
  }
}

</style>
