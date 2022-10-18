import EasyGantt from './easygantt/index.vue'

const components = [EasyGantt]

const install = function (Vue, options = {}) {
  components.forEach(item => {
    Vue.component(item.name, item)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  EasyGantt
}
export default {
  install
}
