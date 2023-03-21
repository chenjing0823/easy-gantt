<template>
  <div class="years-content">
    <div class="years" v-for="item in allDays" :key="`year-${item.year}`">
      <div
        class="month"
        v-for="(value, key) in item.month[0]"
        :key="value + 'zz' + key"
        :style="getMonthStyle(value, currentDaySize)"
      >
        <template v-if="currentDaySize.value === 60">
          <div class="month-top day-view">{{ item.year }}年{{ key }}月</div>
        </template>
        <template v-else-if="currentDaySize.value === 6 || currentDaySize.value === 2">
          <!-- 年视图展示年 季视图展示年 -->
          <div class="year-top" :style="{width: currentDaySize.value * item.days + 'px' }" v-if="+key === 1">{{ item.year }}年</div>
          <div class="month-top"></div>
        </template>
        <template v-else-if="currentDaySize.value === 1.5">
          <div class="month-top year-view" :class="{ yearEndMonth: +key === 1 }"></div>
        </template>
        <div class="month-day">
          <div class="day"
            v-for="(day, index) in value"
            :key="index + 'dd'"
            :style="{ width: currentDaySize.value + 'px' }">
            <!-- 日 -->
            <template v-if="currentDaySize.value === 60">
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
            <!-- 月 -->
            <template v-else-if="currentDaySize.value === 6">
              <!-- 月视图展示月 -->
              <div class="month-start" v-if="index === 0">
                {{ key }}月
              </div>
              <span
                class="dateNum"
                :class="{
                  weekday: day.weekday === 0 || day.weekday === 6,
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
              >
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
                  height: index === 0 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
            <!-- 季 -->
            <template v-else-if="currentDaySize.value === 2">
              <!-- 季视图展示季 -->
              <div class="season-start" v-if="season.includes(+key) && index === 0">
                {{ key | seasonFormat }}
              </div>
              <span
                class="dateNum"
                :class="{
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
              >
              </span>
              <span
                class="dateBG"
                :class="{
                  today: day.today
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: season.includes(+key) && index === 0 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
            <!-- 年 -->
            <template v-else-if="currentDaySize.value === 1.5">
              <div class="year-start" v-if="+key === 1 && index === 0">
                {{ item.year }}
              </div>
              <span
                class="dateNum"
                :class="{
                  isHover:
                    day.width >= currentLineDay.start &&
                    day.width <= currentLineDay.end
                }"
              >
              </span>
              <span
                class="dateBG"
                :class="{
                  today: day.today
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: +key === 1 && index === 0 ? lineBGHeight : '0px'
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
    seasonFormat (val) {
      const month = +val
      const index = [1, 4, 7, 10].findIndex(s => s === month)
      return `${index + 1}季度`
    }
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
      lineBGHeight: 0,
      season: [1, 4, 7, 10] // 季度数组
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
      position: relative;
      .year-top {
        position: absolute;
        left: 0;
        top: 0;
        line-height: 23px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #969799;
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
        border-right: 1px solid #e5e6eb;
      }
      .month-top {
        box-sizing: border-box;
        color: rgba(150, 151, 153, 1);
        font-size: 14px;
        text-align: left;
        font-family: PingFangSC-Regular;
        height: 24px;
        line-height: 24px;
        border-bottom: 1px solid #E5E6EB;
        border-top: 1px solid #E5E6EB;
        display: flex;
        justify-content: center;
      }
      .day-view {
        border-right: 1px solid #e5e6eb;
      }
      .yearEndMonth {
        border-left: 1px solid #e5e6eb;
      }
      .year-view {
        border-bottom: none;
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
          .month-start {
            position: absolute;
            width: 180px;
            left: 0;
            z-index: 1;
            line-height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #969799;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
          .season-start {
            position: absolute;
            width: 180px;
            left: 0;
            z-index: 1;
            line-height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #969799;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
          }
          .year-start {
            position: absolute;
            width: 540px;
            left: 0;
            z-index: 1;
            line-height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #969799;
            font-size: 14px;
            text-align: left;
            font-family: PingFangSC-Regular;
            border-left: 1px solid #e5e6eb;
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
            border-left: 1px solid #F2F3F5;
            background-color: #ffffff;
            // background-color: #F7F8FA;
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
