import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import EasyGantt from '../../packages/index'


export default async ({
  Vue
}) => {
  if (typeof process === 'undefined') {
    Vue.use(ElementUI)
    Vue.use(EasyGantt)
  }
}