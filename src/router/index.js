import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/home/index')
    }]
  },

  {
    path: '/video',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '视频管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/post',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/post'), // Parent router-view
        name: 'Post',
        meta: { title: '主题管理',icon: 'nested' }
      }
      // {
      //   path: 'menu2',
      //   component: () => import('@/views/table/reply'),
      //   meta: { title: '回复管理' }
      // }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/table/user'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Message',
        component: () => import('@/views/table/message'),
        meta: { title: '消息管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'example'
    },
    children: [
      {
        path: 'druid', 
        component: () => import('@/views/external/druid'),
        meta: { title: '数据库监控' ,icon:'link'}
      },
      {
        path: 'swagger', 
        component: () => import('@/views/external/swaggerui'),
        meta: { title: '服务端接口' ,icon:'link'}
      },
      {
        path: 'baidu', 
        component: () => import('@/views/external/baidu'),
        meta: { title: '我是充数的' ,icon:'link'}
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
