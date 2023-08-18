import { reqLogin, reqRegister } from '@/api/user'
import { LoginFormData } from '@/api/user/type'
import { RouteRecordRaw } from 'vue-router'

import router from '@/router'
import { constantRoute, asyncRoutes, anyRoutes } from '@/router/routes.ts'
import { useLayOutSettingStore, useThemeStore } from './setting'
import { useLocaleStore } from './locales'
interface UserState {
  userInfo: {
    [x: string]: string | number
  }
  token: string | null
  serverRoutes: RouteRecordRaw[] // 服务器返回对应权限的路由表
  // menuRoutes: RouteRecordRaw[], //侧边菜单栏渲染的路由表（由常量路由和serverRoutes合并组成）
  resultRoute: RouteRecordRaw[] // 最终的路由表（异步路由表对比serverRoutes）
}

export const useUserInfoStore = defineStore('USERINFO', {
  state: (): UserState => ({
    userInfo: {},
    token: '',
    serverRoutes: [],
    // menuRoutes: constantRoute,
    resultRoute: [],
  }),
  actions: {
    async userLogin(info: LoginFormData) {
      const res = await reqLogin(info)
      const { code, data, msg } = res as any

      if (code === 200) {
        this.userInfo = data.userInfo
        this.token = data.token
        this.serverRoutes = data.menus
        // this.menuRoutes = [...this.menuRoutes,...data.menus]

        // this.addRoutes()
        return `欢迎━(*｀∀´*)ノ亻回来,${data.userInfo.username}`
      } else {
        return Promise.reject(new Error(msg))
      }
    },
    async userRegister(info: LoginFormData) {
      const res: any = await reqRegister(info)
      if (res.code === 200) {
        return `注册成功！欢迎━(*｀∀´*)ノ亻`
      } else {
        return Promise.reject(new Error(res.msg))
      }
    },
    resetToken() {
      const setting = useLayOutSettingStore()
      const useTheme = useThemeStore()
      const locale = useLocaleStore()
      this.$reset()
      setting.reestState()
      useTheme.reestState()
      locale.reestState()
    },
    addRoutes() {
      console.log('动态添加路由')
      const filterRoute: RouteRecordRaw[] = []
      asyncRoutes.forEach((item) => {
        this.menuRoutes.forEach((el) => {
          if (item.name === el.name) {
            filterRoute.push(item)
          }
        })
      })
      this.resultRoute = constantRoute.concat(filterRoute, anyRoutes)
      this.resultRoute.forEach((item) => {
        router.addRoute(item)
      })
    },
  },
  getters: {
    menuRoutes: (state) => [...constantRoute, ...state.serverRoutes],
    getPhone: (state) => state.userInfo.phone,
    getServerMenu: (state) => state.serverRoutes,
  },
  persist: {
    enabled: true,
  },
})
