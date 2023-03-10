<template>
  <div class="gantt-add">
    <el-dialog title="新建" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="form.ower" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择活动区域">
            <el-option label="计划项目" value="1"></el-option>
            <el-option label="里程碑" value="2"></el-option>
            <el-option label="分组" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进度">
          <el-input-number v-model="form.per" :max="100" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item v-show="form.type == 1" label="计划周期" prop="planTime">
          <el-date-picker
            v-model="form.planTime"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="form.type == 2" label="里程碑时间" prop="stoneTime">
          <el-date-picker
            v-model="form.stoneTime"
            format="yyyy 年 MM 月 dd 日"
            placeholder="选择日期"
            type="date"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'gantt-add',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      form: {
        name: '',
        ower: '',
        per: 0,
        type: '1',
        planTime: [],
        stoneTime: ''
      }
    }
  },

  computed: {
  },

  watch: {
  },

  mounted () {
  },

  methods: {
    submit () {
      this.$emit('handlerNew', this.form)
      this.cancel()
    },
    cancel () {
      Object.assign(this.$data, this.$options.data()) // 所有参数init
      this.$emit('update:dialogFormVisible', false)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
