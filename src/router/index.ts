/*
 * @file 路由配置文件
 * @description 定义了应用程序的所有路由，包括路径、组件、名称和元信息，并设置了路由守卫来动态管理页面标题。
 */

// 从 'vue-router' 导入创建路由和创建 Web 历史模式所需的函数
import { createRouter, createWebHistory } from 'vue-router'
// 导入 'vue-router' 中的 RouteRecordRaw 类型，用于定义路由记录的结构
import type { RouteRecordRaw } from 'vue-router'

// 定义路由配置数组，每个对象代表一个路由
const routes: RouteRecordRaw[] = [
  {
    // 根路径 '/'，当用户访问根路径时，重定向到 '/survey' 路径
    path: '/',
    redirect: '/survey'
  },
  {
    // 调查问卷页面路由
    path: '/survey',
    name: 'Survey', 
    component: () => import('../pages/SurveyPage.vue'), 
    meta: { 
      title: '答题页面 - 长歌动漫社入社问卷系统' 
    }
  },
  {
    // 介绍页面路由
    path: '/introduce',
    name: 'Introduce', 
    component: () => import('../pages/IntroducePage.vue'), 
    meta: { 
      title: '介绍页面 - 长歌动漫社入社问卷系统' 
    }
  },
  {
    // 特殊纪念页面路由
    path: '/Good-Night-Joker-ACG-Club',
    name: 'GoodNightJokerACGClub', // 路由名称
    component: () => import('../pages/GoodNightJokerACGClub.vue'), // 对应的组件
    meta: { 
       isSpecialBackground: true, // 是否使用特殊背景
       pcBackground: 'joker-acg-club/background/pc.webp', // PC 端背景图片路径
       mobileBackground: 'joker-acg-club/background/mp.webp', // 移动端背景图片路径
       title: '桂平市第三中学Joker动漫社纪念页 - 长歌动漫社入社问卷系统' // 页面标题
     },
   },
  {
    path: '/review',
    name: 'Review', 
    component: () => import('../pages/ReviewPage.vue'), 
    meta: { // 路由元信息
      title: '审查页面 - 长歌动漫社入社问卷系统' 
    }
  },
  {
    // 404 页面路由，匹配所有未定义的路径
    path: '/:pathMatch(.*)*',
    name: 'NotFound', // 路由名称
    component: () => import('../pages/NotFound.vue'), // 对应的组件
    meta: { // 路由元信息
      title: '页面未找到-长歌动漫社入社问卷系统', // 页面标题
      hidden: true // 是否隐藏，例如在导航菜单中不显示
    }
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式，使 URL 更美观
  routes // 传入定义的路由配置
})

// 全局前置路由守卫：在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 如果目标路由的元信息中定义了标题，则设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string // 将标题设置为字符串类型
  }
  next() // 继续路由导航
})

// 导出路由实例，供应用程序使用
export default router