import Vue from 'vue'
// -------------------------------------------------------
// 引入路由器
import router from './router/MovieRecommend'
// 引入公共样式
import './assets/css/base.css'
// 引入moment.js
import moment from 'moment';
// 引入util
import { install } from './utils';
install(Vue)
// 引入自定义组件
import coms from '@/components/MovieRecommend/components';
Vue.use(coms)
// 引入颜色
import color from './utils/color';
Vue.prototype.color = color
// 引入moment
Vue.prototype.moment = moment
// 引入 iconfont
import '@/assets/icon_font/iconfont.css'
// 引入Axios
import axios from '@/utils/axiosSetting';
Vue.prototype.axios = axios
// 引入词云
import 'echarts-wordcloud';
// 事件车
// 单独再创建一个vue对象,专门用来做事件车
let eventBus = new Vue();
// 为了方便后续使用,注入到页面Vue对象的原型中
Vue.prototype.eventBus = eventBus;
// -------------------------------------------------------
import App from './App.vue'
import VueAxios from 'vue-axios'
// 引入ElementUI
import ElementUI from 'element-ui'
// 引入ElementUI样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入VueRouter
import VueRouter from 'vue-router'
// 引入dataV组件
import dataV from '@jiaminghi/data-view'
// 引入echarts
import * as echarts from 'echarts'
// 地址
import { baseUrl } from '@/utils/base.js'
Vue.prototype.$baseUrl = baseUrl
//挂载echarts在vue上
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
// axios.defaults.withCredentials = true
//防止跳转路由位置为当前页的回调报错提示
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
// 应用element组件
Vue.use(ElementUI);
// 应用VueRouter插件
Vue.use(VueRouter);
// 应用dataV插件
Vue.use(dataV)

new Vue({
	render: h => h(App),
	router: router
}).$mount('#app')
