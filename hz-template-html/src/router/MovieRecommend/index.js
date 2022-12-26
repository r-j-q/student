// 路由配置文件
import VueRouter from 'vue-router'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth.js'
// 项目标题
document.title = '电影推荐系统'

// 引入登录页面组件
import NotFound from '@/pages/NotFound/index.vue';
import Login from '@/pages/MovieRecommend/login';
import Chart from '@/pages/MovieRecommend/chart';

const router = new VueRouter({
  routes: [
    {
      // 默认打开的路由地址
      path: '/',
      redirect: '/login'
    }, {
      // 登陆页面
      path: '/login',
      component: Login
    },
    {
      // 大屏展示页面
      path: '/chart',
      component: Chart
    },
    {
      // NotFond
      path: '*',
      component: NotFound
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login') {
    removeToken()
    localStorage.removeItem('ischangeType')
    next();
  } else if (getToken()) {
    next();
  } else {
    next('/login');
  }
})
export default router  
