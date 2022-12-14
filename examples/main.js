import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import EasyGantt from '../packages/index'

Vue.config.productionTip = false

Vue.use(EasyGantt)

Vue.use(ElementUI)
new Vue({
  render: h => h(App)
}).$mount('#app')
