<template>
  <div class="easy-gantt">
    <el-table
      class="ganttable"
      :data="showTableData"
      border
      @mousedown.native="mousedown"
      >
      <el-table-column
        width="180"
        fixed>
        <template slot-scope="scope">
          <div>{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in tableHead"
        :key="column.prop"
        :label="column.label"
        :data="column"
        width="180">
        <template slot-scope="scope">
          <div class="td-box" :class="`row-id${scope.row.id}`" :data-td="column.prop" :data-id="scope.row.id"></div>
          <div class="cell-block" :style="getCellHeight(scope.row[column.prop])"  :data-td="column.prop">
            <template v-for="(mark, index) in scope.row[column.prop]">
              <div
                v-if="index < limit"
                class="ganttd"
                :key="index"
                :data-td="column.prop"
                @click="tdClick(scope.row[column.prop], mark)"
                :style="getTdStyle(mark, index)">{{ mark.name }}</div>
            </template>
            <div
              class="ganttd__else"
              :style="getTdStyle({ beyondBlock: 0 }, limit)"
              :data-td="column.prop"
              v-if="scope.row[column.prop] && limit < scope.row[column.prop].length">
              还有 {{ scope.row[column.prop].length -  limit }} 个{{ cellMoreTitle }}...
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-if="dialogVisible"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确定添加</span>
      <span>{{ headEnum[handleStart].label }}</span>
      <span>至</span>
      <span>{{ headEnum[handleEnd].label }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <div style="margin-top: 200px">

      <el-button @click="prevMonth">上个月</el-button>
      <el-button @click="nextMonth">下个月</el-button>
      <el-button @click="prevYear">上个年</el-button>
      <el-button @click="nextYear">下个年</el-button>
      <el-button @click="prevWeek">上周</el-button>
      <el-button @click="nextWeek">下周</el-button>
      <DateTable ref="dateTable" :date="date"></DateTable>
      <DateTable :date="date" type="normal"></DateTable>
    </div> -->
  </div>
</template>

<script>
// import DateTable from './date-table.vue'
// import {
//   prevMonth as _prevMonth,
//   nextMonth as _nextMonth,
//   prevYear as _prevYear,
//   nextYear as _nextYear
// } from './date'
export default {
  name: 'EasyGantt',
  components: {
    // DateTable
  },
  props: {
    // 行数限制
    limit: {
      type: Number,
      default: 2
    },
    // 更多标题
    cellMoreTitle: {
      type: String,
      default: '工单'
    },
    // 鼠标滑动添加
    moveToAdd: {
      type: Boolean,
      default: true
    },
    // 使用自定义弹窗
    usePersonalTips: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tdBlockHeight () {
      return 25
    },
    tdPaddingTop () {
      return 9
    }
  },
  data () {
    return {
      date: new Date(),
      dialogVisible: false,
      tableHead: [
        { prop: 'wen', label: '07-13 周三', block: 1 },
        { prop: 'thu', label: '07-14 周四', block: 2 },
        { prop: 'fri', label: '07-15 周五', block: 3 },
        { prop: 'sat', label: '07-16 周六', block: 4 },
        { prop: 'sun', label: '07-17 周天', block: 5 },
        { prop: 'mon', label: '07-18 周一', block: 6 },
        { prop: 'tue', label: '07-19 周二', block: 7 }
      ],
      resources: [
        {
          id: '1',
          title: '陈靖',
          order: 1,
          data: [
            { start: 'wen', end: 'wen', name: '12:00-13:00 工单名称1' },
            { start: 'fri', end: 'sat', name: '12:00-13:00 工单名称2' },
            { start: 'fri', end: 'fri', name: '12:00-13:00 工单名称3' },
            { start: 'fri', end: 'sat', name: '12:00-13:00 工单名称4' },
            { start: 'sat', end: 'sat', name: '12:00-13:00 工单名称5' },
            { start: 'sun', end: 'sun', name: '12:00-13:00 工单名称6' }
          ]
        },
        {
          id: '2',
          title: '余宇豪',
          order: 2,
          data: [
            { start: 'mon', end: 'mon', name: '12:00-13:00 工单名称7' },
            { start: 'mon', end: 'tue', name: '12:00-13:00 工单名称8' }
          ]
        },
        {
          id: '3',
          title: '刘娟娟',
          order: 3,
          data: [
            { start: 'thu', end: 'thu', name: '12:00-13:00 工单名称9' }
          ]
        }
      ],
      headEnum: {},
      showTableData: [],
      handleRowid: null,
      handleStart: null,
      handleEnd: null,
      startLeft: null,
      startTop: null,
      moveLeft: null,
      moveTop: null
    }
  },
  created () {
    this.tableHead.forEach((item, index) => {
      this.$set(this.headEnum, item.prop, { label: item.label, block: index })
    })
    this.renderGantBlock()
  },
  methods: {
    // prevMonth () {
    //   this.date = _prevMonth(this.date)
    // },
    // nextMonth () {
    //   this.date = _nextMonth(this.date)
    // },
    // prevYear () {
    //   this.date = _prevYear(this.date)
    // },
    // nextYear () {
    //   this.date = _nextYear(this.date)
    // },
    // prevWeek () {
    //   if (this.$refs.dateTable.todayrow === 0) {
    //     this.prevMonth()
    //     this.$nextTick(() => {
    //       this.$refs.dateTable.todayrow = this.$refs.dateTable.showRows.length - 1
    //     })
    //   } else {
    //     this.$refs.dateTable.todayrow = this.$refs.dateTable.todayrow - 1
    //   }
    // },
    // nextWeek () {
    //   if (this.$refs.dateTable.todayrow === this.$refs.dateTable.showRows.length - 1) {
    //     this.nextMonth()
    //     this.$nextTick(() => {
    //       this.$refs.dateTable.todayrow = 0
    //     })
    //   } else {
    //     this.$refs.dateTable.todayrow = this.$refs.dateTable.todayrow + 1
    //   }
    // },
    /**
     * @description: 渲染甘特图色块数据处理
     */
    renderGantBlock () {
      // 数据初过滤，获取每格需要渲染的色块数据
      const _showTableData = this.resources.map(data => {
        const obj = {}
        const _data = JSON.parse(JSON.stringify(data))
        _data.data.forEach(item => {
          if (!Object.prototype.hasOwnProperty.call(obj, item.start)) {
            obj[item.start] = []
          }
          item.beyondBlock = this.beyondBlock(item) // 超出格子数
          obj[item.start].push(item)
        })
        return {
          ..._data,
          ...obj
        }
      })
      // 遍历色块数据，处理需要跨时间的色块
      // oi 外层index
      for (let oi = 0; oi < _showTableData.length; oi++) {
        const data = _showTableData[oi]
        // 按顺序遍历需要处理的色块
        this.tableHead.forEach((head) => {
          const item = head.prop // 当前色块prop
          if (Array.isArray(data[item])) { // 若为数组，代表当前色块有数据
            // tdi 当前格子的数据index
            for (let tdi = 0; tdi < data[item].length; tdi++) { // 遍历当前td内的数据，找出有超出的数据，为其后面数据添加占位数据
              const beyondBlock = data[item][tdi].beyondBlock // 超出的格子数
              if (beyondBlock > 0) { // 若有超出格子数 则后面需要有空数据占位
                let mark = 1
                while (mark <= beyondBlock) { // 超出多少格子，后面就补多少个
                  const index = this.tableHead.findIndex(head => head.prop === item) + mark // 当前 td 在表头的index, +mark 为下一个td
                  const prop = this.tableHead[index].prop // 获取下一个td的 prop ，用于给其添加占位数据
                  if (Array.isArray(_showTableData[oi][prop])) {
                    _showTableData[oi][prop].splice(tdi, 0, {}) // 为下个时间块，添加空白占位数据
                  }
                  mark++
                }
              }
            }
          }
        })
      }
      this.showTableData = _showTableData
    },
    /**
     * @description: 计算当前数据是否有跨时间显示
     * @return {Number} 超出的块数，0表示只占本格
     */
    beyondBlock (data) {
      const startBlock = this.headEnum[data.start].block
      const endBlock = this.headEnum[data.end].block
      return endBlock - startBlock
    },
    tdClick (row, item) {
      console.log(row, item)
    },
    /**
     * @description: 获取td内渲染的色块样式，在单元格内的位置为：
     */
    getTdStyle (data, index) {
      const right = -data.beyondBlock * 100 // 负数为跨时间渲染，需要占到隔壁时间
      return `
      user-select: none;
      height: ${this.tdBlockHeight}px;
      right: calc(${right}% + 10px);
      top: ${index * this.tdBlockHeight + this.tdPaddingTop * (index + 1)}px
      `
      // right: calc(${right}% + 10px);  距离单元格右侧距离，
      // top: ${index * 25 + 12}px （数据index * 色块高度 + 单元格上边距12）
    },
    /**
     * @dscription: 单元格高度。 渲染色块是 absolute 布局，所以单元格也需要随着色块数，自动撑开
     */
    getCellHeight (data) {
      let height = this.tdBlockHeight
      if (data && data.length) {
        const length = data.length > this.limit ? this.limit + 1 : data.length
        height = length * this.tdBlockHeight + (length - 1) * this.tdPaddingTop
      }
      return `height: ${height}px;`
    },
    /**
     * @description: 确认操作
     */
    confirm () {
      const rowindex = this.resources.findIndex(res => res.id === this.handleRowid)
      // 添加数据
      this.resources[rowindex].data.push(
        { start: this.handleStart, end: this.handleEnd, name: '12:00-13:00 手动添加' })
      this.renderGantBlock() // 触发渲染
      this.handleClose()
    },
    handleClose (type) {
      this.elementCrash(type)
      this.dialogVisible = false
      this.init()
    },
    init () {
      this.handleRowid = null
      this.handleStart = null
      this.handleEnd = null
      this.startLeft = null
      this.startTop = null
      this.moveLeft = null
      this.moveTop = null
    },
    mousedown (e) {
      if (!this.moveToAdd) {
        return
      }
      // const reg = /row-id\d+/
      // this.handleRow = e.target.className.match(reg)[0]
      if (e.target.className === 'ganttd') return
      this.handleRowid = e.target.dataset.id // 数据row id
      this.handleStart = e.target.dataset.td // 开始时间
      this.startLeft = e.clientX
      this.startTop = e.clientY
      const table = document.documentElement.querySelector('.ganttable')
      table.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    },
    mousemove (e) {
      this.moveLeft = e.clientX
      this.moveTop = e.clientY
      this.crashPlaceholder(this.moveLeft, this.moveTop, this.startLeft, this.startTop)
      this.elementCrash()
    },
    mouseup (e) {
      // console.log(e)
      this.handleEnd = e.target.dataset.td// 结束时间
      const table = document.documentElement.querySelector('.ganttable')
      table.removeEventListener('mousemove', this.mousemove)
      window.removeEventListener('mouseup', this.mouseup)
      if (this.handleEnd) {
        if (this.beyondBlock({ start: this.handleStart, end: this.handleEnd }) < 0) { // 从右往左选
          [this.handleStart, this.handleEnd] = [this.handleEnd, this.handleStart] // 交换开始合结束位置
        }
        if (this.usePersonalTips) {
          const select = {
            start: this.headEnum[this.handleStart].label,
            end: this.headEnum[this.handleEnd].label
          }
          this.$emit('seletcRange', select)
          console.log(select)
          this.handleClose('init')
          return
        }
        this.dialogVisible = true
      } else {
        this.handleClose('init')
      }
    },
    // 生成占位块
    crashPlaceholder (A, B, C, D) {
      // 开始的行列
      const a = A > C ? C : A
      const b = B > D ? D : B

      const hasshow = document.getElementById('show')
      if (hasshow) {
        document.body.removeChild(hasshow)
      }

      const show = document.createElement('div')
      show.id = 'show'
      show.style.width = Math.abs(A - C) + 'px'
      show.style.height = Math.abs(B - D) + 'px'
      show.style.position = 'fixed'
      show.style.left = a + 'px'
      show.style.top = b + 'px'
      // show.style.border = '1px dotted black'
      // show.style.backgroundColor = 'blue'
      document.body.appendChild(show) // 鼠标滑动的区域
    },
    // 碰撞检测 判断鼠标滑动区域与table中重合的部分 进行高亮
    elementCrash (type) {
      const td = document.documentElement.getElementsByClassName(`row-id${this.handleRowid}`)
      for (let i = 0; i < td.length; i++) {
        const _this = td[i]
        if (this.dialogVisible || type === 'init') {
          _this.className = _this.className.replace(' easy-gantt__showColor', '')
          continue
        }
        const domrect = _this.getBoundingClientRect()
        const t1 = domrect.top
        const l1 = domrect.left
        const r1 = domrect.left + domrect.width
        const b1 = domrect.top + domrect.height

        const show = document.getElementById('show')
        const domrect2 = show.getBoundingClientRect()
        const t2 = domrect2.top
        const l2 = domrect2.left
        const r2 = domrect2.left + domrect2.width
        const b2 = domrect2.top + domrect2.height

        // 鼠标滑动区域 与 当前行的单元格重叠，即为选中的时间跨度
        if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) {
          _this.className = _this.className.replace(' easy-gantt__showColor', '')
        } else {
          _this.className = _this.className.replace(' easy-gantt__showColor', '')
          _this.className = _this.className + ' easy-gantt__showColor'
        }
      }
    }
  }
}
</script>

<style>
.easy-gantt__showColor {
  background-color: rgb(36, 141, 245, 0.3) !important;
}
</style>
<style scoped>
.easy-gantt {
  position: relative;
  width: 100%;
  height: 100%;
}
.ganttable {
  /* min-width: max-content; */
  width: max-content;
}
.ganttd {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 0px 12px;
  background-color: #248DF5;
  left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 9px;
  z-index: 1;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.ganttd__else {
  position: absolute;
  padding: 0px 12px;
  left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 9px;
  z-index: 1;
  color: rgba(50, 50, 51, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.td-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
