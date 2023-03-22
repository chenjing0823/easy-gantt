<template>
  <div class="add-stage">
    <template v-if="clickData.id === item.id && type !== 'normal'">
      <div class="card-block new-stage-form">
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
    </template>
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
    addNewStage () {
      this.$emit('handlerNewStage', {
        name: this.name,
        ower: '',
        per: 0,
        type: '3',
        planTime: this.planTime,
        stoneTime: ''
      },
      this.clickData,
      () => {
        this.cancel()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

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
</style>
