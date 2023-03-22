<template>
  <div class="left-card">
    <div class="card-block" v-for="(item, index) in list" :key="item.id">
      <div class="left-card__head head-height">
        <div>
          <i class="el-icon-caret-bottom" v-if="item.expand" @click="expandData(index, false)"></i>
          <i class="el-icon-caret-top" v-else @click="expandData(index, true)"></i>
          <span>{{ item.name }}</span>
        </div>
        <div class="head-operate">
          <i class="el-icon-plus" @click="newTask(item)"></i>
          <el-popover
            placement="bottom"
            width="154"
            trigger="click">
            <div>更多操作</div>
            <i class="el-icon-more" slot="reference"></i>
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
    <div class="new-stage card-block" v-if="!isNew" @click="isNew = true">
      + 新建项目阶段
    </div>
    <div class="card-block new-stage-form" v-else>
      <div>
        <el-input class="input-name" v-model="name" size="small" placeholder="请输入名称"></el-input>
        <el-date-picker
          v-model="planTime"
          end-placeholder="预计结束日期"
          format="yyyy 年 MM 月 dd 日"
          range-separator="~"
          start-placeholder="预计开始日期"
          type="daterange"
          value-format="timestamp"
          size="small"
        >
        </el-date-picker>
      </div>
      <div class="bottom">
        <div class="stage-button" @click="cancel">取消</div>
        <div class="stage-button confirm" @click="addNewStage">确定</div>
      </div>
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
  data () {
    return {
      name: '',
      planTime: [],
      isNew: false
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
      this.isNew = false
    }
    lineBG.onscroll = () => {
      if (lineBGchange) {
        leftCard.scrollTop = lineBG.scrollTop / (lineBG.scrollHeight - lineBG.clientHeight) * (leftCard.scrollHeight - leftCard.clientHeight)
        leftCardchange = false
      } else {
        lineBGchange = true
      }
      this.isNew = false
    }
  },
  methods: {
    newTask (item) {
      this.$emit('handlerNewTask', item)
    },
    cancel () {
      this.isNew = false
      this.name = ''
      this.planTime = []
    },
    addNewStage () {
      this.$emit('handlerNewStage', {
        name: this.name,
        ower: '',
        per: 0,
        type: '3',
        planTime: this.planTime,
        stoneTime: ''
      }, () => {
        this.cancel()
      })
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
  .new-stage {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 20px
    color: rgba(150, 151, 153, 1);
    font-size: 14px;
    text-align: left;
    font-family: PingFangSC-Regular;
    position: sticky;
    bottom: 0;
    margin-bottom: 0;
  }
  .new-stage:hover {
    cursor: pointer;
    color: rgba(255, 140, 46, 1);
    background-color: #FFF5E8;
  }
  .new-stage-form {
    padding: 12px;
    position: sticky;
    bottom: 0;
    .input-name {
      margin-bottom: 10px;
    }
    /deep/ .el-date-editor {
      width: 100%;
    }
    /deep/ .el-icon-date {
      display: none;
    }
    /deep/ .el-range-input {
      font-size: 12px;
    }
    .bottom {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
    .stage-button {
      cursor: pointer;
      height: 28px;
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #EBEEF5;
      margin-left: 10px;
      line-height: 22px;
      color: rgba(100, 101, 102, 1);
      font-size: 14px;
      text-align: center;
      font-family: PingFangSC-Regular;
      border-radius: 4px;
    }
    .confirm {
      color: #ffffff
      background-color: #FF6A00;
    }
  }
}

</style>
