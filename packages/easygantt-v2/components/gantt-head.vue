<template>
  <div class="years-content">
    <div class="years" v-for="item in allDays" :key="`year-${item.year}`">
      <div
        class="month"
        v-for="(value, key) in item.month[0]"
        :key="value + 'zz' + key"
        :style="getMonthStyle(value, currentDaySize)"
      >
        <div class="month-top">{{ item.year }}年{{ key }}月</div>
        <div class="month-day">
          <div class="day"
            v-for="(day, index) in value"
            :key="index + 'dd'"
            :style="{ width: currentDaySize.value + 'px' }">
            <template v-if="currentDaySize.value === 40">
              <span
                class="dateNum border-line"
                :class="{
                  todayNum: day.today,
                  weekday: day.weekday === 0 || day.weekday === 6,
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
                >{{ day.date }}</span
              >
              <span
                class="dateBG"
                :class="{
                  weekday2: day.weekday === 0,
                  weekday1: day.weekday === 6,
                  today: day.today
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: lineBGHeight
                }"
              ></span>
            </template>
            <template v-else-if="currentDaySize.value === 24">
              <span
                class="dateNum"
                :class="{
                  weekday: day.weekday === 0 || day.weekday === 6,
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end,
                  nodBorder:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
              >
                <div
                  style="width:100%21px;height:100%;"
                  :style="{
                    borderLeft: index === 0 ? 'none' : '1px solid #d7d7d7'
                  }"
                  v-show="
                    (day.width === currentLineDay.end &&
                      isHover &&
                      day.weekday !== 1) ||
                      (day.width === currentLineDay.start &&
                        isHover &&
                        day.weekday !== 1) ||
                      day.weekday === 1
                  "
                >
                  {{ day.date }}
                </div>
              </span>
              <span
                class="dateBG"
                :class="{
                  weekday2: day.weekday === 0,
                  weekday1: day.weekday === 6,
                  today: day.today
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height:
                    day.weekday === 0 || day.weekday === 6 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
            <template v-else-if="currentDaySize.value === 12">
              <span
                class="dateNum"
                :class="{
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end,
                  nodBorder:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
              >
                <div
                  style="width:100%;height:100%;font-size:10px!important;"
                  :style="{
                    borderLeft: index === 0 ? 'none' : '1px solid #d7d7d7'
                  }"
                  v-show="
                    (day.width === currentLineDay.end && isHover && day.date !== 1) ||
                      (day.width === currentLineDay.start &&
                        isHover &&
                        day.date !== 1) ||
                      day.date === 1
                  "
                >
                  {{ day.date }}
                </div>
              </span>
              <span
                class="dateBG weekday2"
                :class="{
                  today: day.today
                }"
                style="border-right:none;"
                :style="{
                  width: currentDaySize.value + 'px',
                  height:
                    day.weekday === 0 || day.weekday === 6 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gantt-head',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
    allDays: {
      type: Array,
      default: () => []
    },
    currentDaySize: {
      type: Object,
      default: () => {
        return {
          label: '天',
          value: 40
        }
      }
    },
    currentLineDay: {
      type: Object,
      default: () => {
        return {
          start: 0,
          end: 0
        }
      }
    },
    isHover: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // 背景高度
      lineBGHeight: 0
    }
  },

  computed: {
  },

  watch: {
  },

  mounted () {
    this.setStoneLine()
  },

  methods: {
    // 设置里程碑线的高度
    setStoneLine (isFirst) {
      this.$nextTick(() => {
        const height = getComputedStyle(document.querySelector('.lineBG')).height
        this.lineBGHeight = height
      })
    },
    getMonthStyle (value, currentDaySize) {
      return { width: value.length * currentDaySize.value + 'px' }
    }
  }
}
</script>

<style lang="stylus" scoped>
.years-content {
  display: flex
  .years {
    display: flex
    height: 100%;
    .month {
      height: 100%;
      .month-top {
        color: rgba(150, 151, 153, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
        height: 23px;
        line-height: 23px;
        border-bottom: 1px solid #E5E6EB;
        display: flex;
        justify-content: center;
      }
      .month-day {
        display: flex;
        .day {
          // width: 40px;
          position: relative;
          display: inline-block;
          height: calc(100% - 21px);
          box-sizing: border-box;
          text-align: center;
          flex: none;
          background-color: #ffffff
          .isHover {
            border-bottom: 2px solid #74C3FF !important;
          }
          .nodBorder {
            div {
              border-left: none !important;
            }
          }
          .dateNum {
            color: rgba(150, 151, 153, 1);
            font-size: 14px;
            font-family: PingFangSC-Regular;
            line-height: 26px;
            display: block;
            height: 26px;
            border-bottom: 1px solid #d7d7d7;
            box-sizing: border-box;
          }

          // .todayDateNum {
          //   background-color: #f0a100;
          //   color: #fff;
          // }
          .dateBG {
            position: absolute;
            top: 26px;
            left: 0px;
            display: block;
            height: 100%;
            border-left: 1px solid #E5E6EB;
            background-color: #F7F8FA;
          }
          .weekday {
            color: #c7c7c7;
          }
          // .today {
          //   position: relative;
          // }
          .today::after {
            content: "";
            height: 100%;
            width: 2px;
            // background-color: #f0a100;
            position: absolute;
            // left: 20px;
            top: 0px;
            background-image: linear-gradient(#f0a100 50%, #ffffff00 0%); /* 35%设置虚线点y轴上的长度 */
            background-position: left; /* right配置右边框位置的虚线 */
            background-size: 1px 10px; /* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
            background-repeat: repeat-y;
          }
        }
      }
    }
  }
}
</style>
