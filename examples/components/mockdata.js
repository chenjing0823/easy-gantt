export default {
  1: [
    {
      name: '完成工作计划完成工作计划划1',
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
      id: 11
    },
    {
      name: '完成工作计划完成工作计划划2',
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
      id: 12,
      hasChildren: true
    }
  ],
  2: [
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
      id: 21
    }
  ],
  3: [
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
      id: 31
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
      id: 32
    }
  ],

  // 完成工作计划完成工作计划划2的子
  12: [
    {
      name: '第二层1',
      ower: '',
      per: 0,
      type: '1',
      planTime: [1677945600000, 1678118400000],
      stoneTime: '',
      startTime: 1677945600000,
      endTime: 1678118400000,
      id: 121,
      hasChildren: true
    },
    {
      name: '第二层2',
      ower: '',
      per: 0,
      type: '1',
      planTime: [
        1678032000000,
        1678204800000],
      stoneTime: '',
      startTime: 1678032000000,
      endTime: 1678204800000,
      id: 122,
      hasChildren: true
    }
  ],

  // 完成工作计划完成工作计划划2的子
  121: [
    {
      name: '第二层1第三层1',
      ower: '',
      per: 0,
      type: '1',
      planTime: [1677945600000, 1678118400000],
      stoneTime: '',
      startTime: 1677945600000,
      endTime: 1678118400000,
      id: 1211
    },
    {
      name: '第二层1第三层2',
      ower: '',
      per: 0,
      type: '1',
      planTime: [
        1678032000000,
        1678204800000],
      stoneTime: '',
      startTime: 1678032000000,
      endTime: 1678204800000,
      id: 1212
    }
  ],

  // 完成工作计划完成工作计划划2的子
  122: [
    {
      name: '第二层2第三层1',
      ower: '',
      per: 0,
      type: '1',
      planTime: [1677945600000, 1678118400000],
      stoneTime: '',
      startTime: 1677945600000,
      endTime: 1678118400000,
      id: 1221
    },
    {
      name: '第二层2第三层2',
      ower: '',
      per: 0,
      type: '1',
      planTime: [
        1678032000000,
        1678204800000],
      stoneTime: '',
      startTime: 1678032000000,
      endTime: 1678204800000,
      id: 1222
    }
  ]
}
