import EasyGantt from './easygantt/index.vue'
import EasyGanttV2 from './easygantt-v2/index.vue'

const components = [EasyGantt, EasyGanttV2]

const install = function (Vue, options = {}) {
  components.forEach(item => {
    Vue.component(item.name, item)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  EasyGantt,
  EasyGanttV2
}
export default {
  install
}
