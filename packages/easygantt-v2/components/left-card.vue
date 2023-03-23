<template>
  <div class="left-card">
    <template v-for="(item, index) in list">
      <div :key="item.id" class="card-block">
        <div class="head-height left-card__head">
          <div>
            <i
              v-if="item.expand"
              class="el-icon-caret-bottom operator-icon"
              @click="expandData(index, false)"
            ></i>
            <i v-else class="el-icon-caret-top operator-icon" @click="expandData(index, true)"></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="head-operate">
            <i class="el-icon-plus operator-icon" @click="newTask(item)"></i>
            <el-popover placement="bottom" trigger="click" width="154">
              <div>
                <div @click="editStageAfterCur(item)">编辑</div>
                <div @click="addStageAfterCur(item)">在此之后添加阶段</div>
                <div @click="deleteStage(item)">删除</div>
              </div>
              <i
                :ref="'moreOperator' + item.id"
                slot="reference"
                class="el-icon-more operator-icon"
                @click="moreOperator(item)"
              ></i>
            </el-popover>
          </div>
        </div>
        <template v-if="item.children && item.children.length">
          <div v-show="item.expand" class="left-card__body">
            <div v-for="child in item.children" :key="child.id" class="left-card__body-height">
              {{ child.name }}
            </div>
          </div>
        </template>
      </div>
      <new-stage
        v-if="curData.id === item.id"
        :key="item.id + 'newstage'"
        class="card-block"
        :click-data="curData"
        :is-new.sync="isNew"
        :item="item"
        :type="type"
        @handlerEditStage="handlerEditStage"
        @handlerNewStage="handlerNewStage"
        @initClickData="init"
      ></new-stage>
    </template>
    <new-stage
      class="card-block"
      :is-new.sync="isNew"
      @handlerNewStage="handlerNewStage"
    ></new-stage>
  </div>
</template>

<script>
import NewStage from './new-stage.vue'

export default {
  name: 'LeftCard',

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
      curData: {},
      type: 'normal'
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
        lineBG.scrollTop =
          (leftCard.scrollTop / (leftCard.scrollHeight - leftCard.clientHeight)) *
          (lineBG.scrollHeight - lineBG.clientHeight)
        lineBGchange = false
      } else {
        leftCardchange = true
      }
      this.init()
    }
    lineBG.onscroll = () => {
      if (lineBGchange) {
        leftCard.scrollTop =
          (lineBG.scrollTop / (lineBG.scrollHeight - lineBG.clientHeight)) *
          (leftCard.scrollHeight - leftCard.clientHeight)
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
        const index = this.list.findIndex((item) => item.id === clickData.id) + 1
        this.$emit('handlerNewStage', data, index, callback)
      } else {
        this.$emit('handlerNewStage', data, '', callback)
      }
    },
    handlerEditStage (data, clickData, callback) {
      const index = this.list.findIndex((item) => item.id === clickData.id)
      this.$emit('handlerEditStage', data, index, callback)
    },
    addStageAfterCur (item) {
      this.type = 'new'
      this.curData = item
      this.isNew = false
      this.$refs[`moreOperator${item.id}`][0].click() // 模拟点击 试popover消失
    },
    editStageAfterCur (item) {
      this.type = 'edit'
      this.curData = item
      this.isNew = false
      this.$refs[`moreOperator${item.id}`][0].click() // 模拟点击 试popover消失
    },
    deleteStage (data) {
      const index = this.list.findIndex((item) => item.id === data.id)
      this.$emit('handlerDeleStage', index)
    },
    init () {
      this.type = 'normal'
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
