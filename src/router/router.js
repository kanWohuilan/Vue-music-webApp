
import Vue from 'vue'
import VueRouter from 'vue-router'


const Recommend = () => import('../components/recommend/Recommend')
const Singer = () => import('../components/singer/Singer')
const Rank = () => import('../components/rank/Rank')
const Search = () => import('../components/search/Search')
const SingerDetail = () => import('../components/singer-detail/SingerDetail')
const Disc = () => import('../components/disc/Disc')
const TopList = () => import('../components/top-list/TopList')
const Mv = () => import('../components/mv/Mv')
const User = () => import('../components/user/User')

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {

return originalPush.call(this, location).catch(err => err)

}
const router = new VueRouter({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        },
      ]
     
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {path: ':id',
        component: SingerDetail
      }
      ]
      
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {path: ':id',
        component: TopList
      }
      ]
     
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/mv',
      component:Mv
    },
    {
      path: '/user',
      component: User
    }
    
  ]
})

export default router