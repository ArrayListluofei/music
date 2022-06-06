import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Recommend from '../components/Recommend'
import Rank from '../components/Rank'
import Sheet from '../components/Sheet'
import Vedio from '../components/Vedio'
import Singer from '../components/Singer'
import Search from '../components/Search'
import My from '../components/My'
import SheetDetail from '../components/SheetDetail.vue'
import SingerDetail from '../components/SingerDetail.vue'
import VedioDetail from '../components/VedioDetail.vue'

Vue.use(Router)

const routes = [
  // 直接显示的页面，默认为第一个tab
  { path: '/', redirect: '/My' },
  {
    path: '/Home',
    component: Home,
    children: [
      {
        path: '/Recommend',
        component: Recommend
      },
      {
        path: '/Rank',
        component: Rank
      },
      {
        path: '/Sheet',
        component: Sheet
      },
      {
        path: '/Vedio',
        component: Vedio
      },
      {
        path: '/Singer',
        component: Singer
      },
      {
        path: '/Search',
        component: Search
      },
      {
        path: '/My',
        component: My
      },
      {
        path: '/SheetDetail',
        component: SheetDetail
      },
      {
        path: '/SingerDetail',
        component: SingerDetail
      },
      {
        path: '/VedioDetail',
        component: VedioDetail
      }
    ]
  }
]

const router = new Router({
  routes
})

export default router
