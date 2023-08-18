import { RouteRecordRaw } from 'vue-router'
import layui from '@/layout/index.vue'
// 常量路由：不需要权限
export const constantRoute: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'layout',
    // shallowRef解决警告，提高性能
    component: shallowRef(layui),
    meta: {
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'home',
          hidden: false,
          svg: 'home',
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      hidden: true,
    },
  },
]
// 异步路由，需要权限
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/comic-manager',
    name: '漫画管理',
    component: shallowRef(layui),
    redirect: '/comic-category',
    meta: {
      title: '漫画管理',
    },
    children: [
      {
        path: '/comic-category',
        name: '漫画分类',
        meta: { title: '漫画分类', keepAlive: true, hidden: false },
        component: () => import('@/views/comic-manager/comic-category.vue'),
      },
      {
        path: '/comic-list',
        name: '漫画列表',
        meta: { title: '漫画列表', keepAlive: true, hidden: false },
        component: () => import('@/views/comic-manager/comic-list.vue'),
      },
    ],
  },
  {
    path: '/video-manager',
    name: '视频管理',
    component: shallowRef(layui),
    redirect: '/video-category',
    meta: {
      title: '视频管理',
    },
    children: [
      {
        path: '/video-category',
        name: '视频分类',
        meta: { title: '视频分类', keepAlive: true, hidden: false },
        component: () => import('@/views/video-manager/video-category.vue'),
      },
      {
        path: '/video-list',
        name: '视频列表',
        meta: { title: '视频列表', keepAlive: true, hidden: false },
        component: () => import('@/views/video-manager/video-list.vue'),
      },
    ],
  },
  {
    path: '/datacenter',
    name: '数据中心',
    component: shallowRef(layui),
    redirect: '/comic-collection',
    meta: {
      title: '数据中心',
    },
    children: [
      {
        path: '/comic-collection',
        name: '漫画采集',
        meta: { title: '漫画采集', keepAlive: true, hidden: false },
        component: () => import('@/views/datacenter/comic-collection.vue'),
      },
    ],
  },
  {
    path: '/system-manager',
    name: '系统管理',
    component: shallowRef(layui),
    redirect: '/system-account',
    meta: {
      title: '系统管理',
    },
    children: [
      {
        path: '/system-account',
        name: '账号管理',
        meta: { title: '账号管理', keepAlive: true, hidden: false },
        component: () => import('@/views/system-manager/account.vue'),
      },
      {
        path: '/system-role',
        name: '角色管理',
        meta: { title: '角色管理', keepAlive: true, hidden: false },
        component: () => import('@/views/system-manager/role.vue'),
      },
    ],
  },
  {
    path: '/novel-manager',
    name: '小说管理',
    component: shallowRef(layui),
    redirect: '/novel-category',
    meta: {
      title: '小说管理',
    },
    children: [
      {
        path: '/novel-category',
        name: '小说分类',
        meta: { title: '小说分类', keepAlive: true, hidden: false },
        component: () => import('@/views/novel-manager/novel-category.vue'),
      },
      {
        path: '/novel-list',
        name: '小说列表',
        meta: { title: '小说列表', keepAlive: true, hidden: false },
        component: () => import('@/views/novel-manager/novel-list.vue'),
      },
    ],
  },
]
// 任意路由，路由发生错误时
export const anyRoutes: RouteRecordRaw[] = [
  // 没有匹配以上的路由会重定向到404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404',
    meta: {
      title: '任意路由',
      hidden: true,
    },
  },
]
