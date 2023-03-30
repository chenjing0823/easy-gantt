<template>
  <div class="add-stage" :class="{ firstShow: clickData.id === item.id && type !== 'normal' }">
    <!-- 某条数据后新建 -->
    <template v-if="clickData.id === item.id && type !== 'normal'">
      <div class="card-block new-stage-form">
        <div>
          <el-input class="input-name" v-model="name" size="small" placeholder="请输入名称"></el-input>
          <el-date-picker
            v-model="planTime"
            end-placeholder="预计结束日期"
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
          <div class="stage-button confirm" @click="confirmDispatch">确定</div>
        </div>
      </div>
    </template>
    <!-- 常规底部新建 -->
    <template v-else>
      <div class="new-stage card-block" v-if="!isNew" @click="addStage">
        + 新建项目阶段
      </div>
      <div class="card-block new-stage-form" v-else>
        <div>
          <el-input class="input-name" v-model="name" size="small" placeholder="请输入名称"></el-input>
          <el-date-picker
            v-model="planTime"
            end-placeholder="预计结束日期"
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
    </template>
  </div>
</template>

<script>
export default {
  name: 'add-stage',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'normal'
    },
    clickData: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      name: '',
      planTime: []
    }
  },

  mounted () {
    if (this.type === 'edit') {
      this.name = this.item.name
      this.planTime = [this.item.startTime, this.item.endTime]
    }
  },

  methods: {
    addStage () {
      this.$emit('update:isNew', true)
    },
    cancel () {
      this.$emit('update:isNew', false)
      this.$emit('initClickData')
      this.name = ''
      this.planTime = []
    },
    confirmDispatch () {
      if (this.type === 'edit') {
        this.editStage()
      } else {
        this.addNewStage()
      }
    },
    editStage () {
      const data = {
        name: this.name,
        planTime: this.planTime
      }
      this.$emit('handlerEditStage',
        data,
        this.clickData,
        () => {
          this.cancel()
        }
      )
    },
    addNewStage () {
      const data = {
        name: this.name,
        ower: '',
        per: 0,
        type: '3',
        planTime: this.planTime,
        stoneTime: ''
      }
      this.$emit('handlerNewStage',
        data,
        this.clickData,
        () => {
          this.cancel()
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.add-stage {
  position: sticky;
  bottom: 0;
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
    margin-bottom: 0;
    box-sizing: border-box;
    border-top: 1px solid #f7f8fa;
  }
  .new-stage:hover {
    cursor: pointer;
    color: rgba(255, 140, 46, 1);
    background-color: #FFF5E8;
  }
  .new-stage-form {
    padding: 12px;
    box-sizing: border-box;
    border-top: 1px solid #f7f8fa;
    .input-name {
      margin-bottom: 10px;
    }
    /deep/ .el-date-editor {
      width: 100%;
    }
    /deep/ .el-icon-date {
      display: none;
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
.firstShow {
  z-index: 1;
}
</style>
