import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'
import { useUserInfoStore } from '@/store/modules/user'
// import {ElMessage} from 'element-plus'
import * as NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/getPageTitle'
NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  // 切换到新路由时，页面滚到顶部，
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})
const whiteList = ['/login'] // no redirect whitelist
let isAdd = false

router.beforeEach(async (to, _, next) => {
  const useUserStore = useUserInfoStore()

  NProgress.start()
  document.title = getPageTitle((to.meta.title || to.name) as string)

  const hasToken = useUserStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!isAdd) {
        useUserStore.addRoutes()
        isAdd = true
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
export default router
