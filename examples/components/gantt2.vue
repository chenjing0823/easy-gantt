<template>
  <div class="gantt2" style="display: flex;">
    <!-- <div>asdas</div> -->
    <EasyGanttV2
      :list="list"
      :line="line"
      :dataList="dataList"
      @handleTimeChange="handleTimeChange"></EasyGanttV2>
  </div>
</template>

<script>
export default {
  name: 'gantt2',

  components: {
  },

  filters: {
  },

  mixins: [],
  props: {
  },

  data () {
    return {
      line: [
        { id: 1, sourceid: 1589512287571, targetid: 1589512309848 }
      ],
      dataList: [
        {
          name: '项目启动阶段',
          ower: '',
          per: 30,
          type: '3',
          planTime: [],
          stoneTime: '',
          startTime: 1677945600000,
          endTime: 1678982400000,
          id: 1589512272596,
          children: [
            {
              name: '完成工作计划1',
              ower: '',
              per: 50,
              type: '1',
              planTime: [
                1589472000000,
                1589817600000
              ],
              stoneTime: '',
              startTime: 1677945600000,
              endTime: 1678291200000,
              id: 1589512287571,
              parentId: 1589512272596
            },
            {
              name: '完成工作计划2',
              ower: '',
              per: 100,
              type: '1',
              planTime: [
                1589817600000,
                1590076800000
              ],
              stoneTime: '',
              startTime: 1678723200000,
              endTime: 1678982400000,
              id: 1589512309848,
              parentId: 1589512272596
            }
          ]
        },
        {
          name: '项目阶段2',
          ower: '',
          per: 100,
          type: '3',
          planTime: [],
          stoneTime: 1678723200000,
          startTime: 1678723200000,
          endTime: 1678723200000,
          id: 1678723200000,
          children: [

            {
              name: '里程碑1',
              ower: '',
              per: 100,
              type: '2',
              planTime: [
                1589817600000,
                1590076800000
              ],
              stoneTime: 1678896000000,
              startTime: 1678896000000,
              endTime: 1678896000000,
              id: 1678896000000,
              parentId: 1678723200000
            }
          ]
        }
      ],
      list: []

      // dataList: [],
      // list: [
      //   {
      //     name: '项目启动阶段',
      //     ower: '',
      //     per: 30,
      //     type: '3',
      //     planTime: [],
      //     stoneTime: '',
      //     startTime: '',
      //     endTime: '',
      //     id: 1589512272596,
      //     expand: true,
      //     top: 8,
      //     isShow: true,
      //     children: [
      //       {
      //         name: '完成工作计划1',
      //         ower: '',
      //         per: 50,
      //         type: '1',
      //         planTime: [
      //           1589472000000,
      //           1589817600000
      //         ],
      //         stoneTime: '',
      //         startTime: 1677945600000,
      //         endTime: 1678291200000,
      //         left: 17120,
      //         widthChild: 200,
      //         widthMe: 200,
      //         top: 46,
      //         id: 1589512287571,
      //         isShow: true,
      //         parentId: 1589512272596
      //       },
      //       {
      //         name: '完成工作计划2',
      //         ower: '',
      //         per: 100,
      //         type: '1',
      //         planTime: [
      //           1589817600000,
      //           1590076800000
      //         ],
      //         stoneTime: '',
      //         startTime: 1678723200000,
      //         endTime: 1678982400000,
      //         left: 17480,
      //         widthChild: 160,
      //         widthMe: 160,
      //         top: 86,
      //         id: 1589512309848,
      //         isShow: true,
      //         parentId: 1589512272596
      //       }
      //     ],
      //     widthChild: 520,
      //     widthMe: 520,
      //     left: 17120
      //   },
      //   {
      //     name: '项目里程碑1',
      //     ower: '',
      //     per: 100,
      //     type: '2',
      //     planTime: [],
      //     stoneTime: 1678723200000,
      //     startTime: 1678723200000,
      //     endTime: 1678723200000,
      //     left: 17760,
      //     widthChild: 40,
      //     widthMe: 40,
      //     top: 128,
      //     id: 1678723200000,
      //     isShow: true
      //   },
      //   {
      //     name: '项目里程碑2',
      //     ower: '',
      //     per: 100,
      //     type: '2',
      //     planTime: [
      //       1679500800000,
      //       1679500800000
      //     ],
      //     stoneTime: 1679500800000,
      //     startTime: 1679500800000,
      //     endTime: 1679500800000,
      //     left: 17840,
      //     widthChild: 40,
      //     widthMe: 40,
      //     top: 168,
      //     id: 1679500800000,
      //     isShow: true
      //   }
      // ]
    }
  },

  computed: {
  },

  watch: {
  },

  mounted () {
  },

  methods: {
    handleTimeChange (data) {
      // const first = this.list.findIndex(first => {
      //   return first.id === data.parentId
      // })
      // const second = this.list[first].children.findIndex(second => {
      //   return second.id === data.id
      // })
      // this.list[first].children[second].startTime = data.startTime
      // this.list[first].children[second].endTime = data.endTime
    }
  }
}
</script>
<style lang="stylus">
.gantt2 {
  height: 900px;
  width: 100%;
}
</style>
