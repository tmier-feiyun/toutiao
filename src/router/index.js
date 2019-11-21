import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/login'
// import Home from '../views/home/index.vue'

// 进度条
// 引入nprogress相关的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/home'
},
{
  path: '/login',
  component: Login
},
// { path: '/home', component: Home }
{
  path: '/home',
  name: 'home',
  component: () => import('@/views/home/index.vue'),
  redirect: '/welcome',
  children: [
    { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
    { path: '/account', name: 'account', component: () => import('@/views/account/account.vue') },
    { path: '/articleedit/:editid', name: 'articleedit', component: () => import('@/views/articleedit/articleedit.vue') },
    { path: '/article', name: 'article', component: () => import('@/views/article') },
    { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd/articleadd.vue') },
    { path: '/material', name: 'material', component: () => import('@/views/material/material.vue') },
    { path: '/fans', name: 'fans', component: () => import('@/views/fans/fans.vue') },
    { path: '/fansnow', name: 'fansnow', component: () => import('@/views/fansnow/fansnow.vue') },
    { path: '/fanslist', name: 'fanslist', component: () => import('@/views/fanslist/fanslist.vue') }

  ]
}

]

const router = new VueRouter({
  routes
})
// 路由守卫设置
// router.beforeEach((to, from, next) => {
//   var userinfo = window.sessionStorage.getItem('userinfo')
//   if (!userinfo && to.path !== '/login') {
//     return next('/login')
//   }
//   next()
// })

router.beforeEach((to, from, next) => {
  NProgress.inc()
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})
router.afterEach((to, from) => {
  NProgress.done()
})

export default router
