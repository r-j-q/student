import BaseTable from './BaseTable/BaseTable.vue';
import VirtualScroller from './VirtualScroller/VirtualScroller.vue';
import LightBorder from './LightBorder/LightBorder.vue';

const coms = [BaseTable, VirtualScroller, LightBorder]  // 将来如果有其它组件,都可以写到这个数组里

// 批量注册组件
const install = function (Vue) {
  coms.forEach((com) => {
    Vue.component(com.name, com)
  })
}

export default install;  // 这个方法以后再使用的时候可以被use调用