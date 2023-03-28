<template>
  <div class="left-card">
    <template v-for="(item, index) in list">
      <div :key="item.id" class="card-block">
        <left-card-stage
          :curIndex="index"
          :item="item"
          @expandData="expandData"
          @newTask="newTask"
          @editStageAfterCur="editStageAfterCur"
          @addStageAfterCur="addStageAfterCur"
          @deleteStage="deleteStage"
          @moreOperator="moreOperator"
        ></left-card-stage>

        <template v-if="item.children && item.children.length">
          <div v-show="item.expand" class="left-card__body">
            <template v-for="child in item.children">
              <left-card-body
                v-show="child.isShow"
                :key="child.id"
                :child="child"
                :expand="child.expand"
                @expandTaskData="expandTaskData"
                @handlerOperateChild="handlerOperateChild"></left-card-body>
            </template>
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
import LeftCardStage from './left-card-stage.vue'
import LeftCardBody from './left-card-body.vue'

export default {
  name: 'LeftCard',

  components: {
    NewStage,
    LeftCardStage,
    LeftCardBody
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
    },
    editStageAfterCur (item) {
      this.type = 'edit'
      this.curData = item
      this.isNew = false
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
    handlerOperateChild (type, data) {
      this.$emit('handlerOperateChild', type, data)
    },
    /**
     * @description: 收起项目
     * @param {Number} 目标项目阶段所在数组下标
     * @param {Boolean} 设置状态 false收起 true展开
     * @param {Number} 收起展开的任务id
     */
    expandData (index, state, id) {
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
    /**
     * @description: 收起任务
     * @param {Object} 目标任务
     * @param {Boolean} 设置状态 false收起 true展开
     */
    expandTaskData (task, state) {
      const index = task.currentListIndex
      task.expand = state
      const { id } = task
      this.list[index].children.forEach((child, cindex) => {
        if (child.originIds.includes(id)) { // 判断收展目标任务的id 是否在子任务的 originIds 里即可
          child.isShow = state
        }
      })
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

  .left-card__body {
    line-height: 20px;
    color: rgba(100, 101, 102, 1);
    font-size: 12px;
    text-align: left;
    font-family: PingFangSC-Regular;
  }
}
</style>
