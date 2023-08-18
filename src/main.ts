import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist' // 引入持久化插件
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import gloablComponent from './components/index'

import 'virtual:svg-icons-register'
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import i18n from './locales'
import initTheme from '@/utils/theme'
const pinia = createPinia()
pinia.use(piniaPluginPersist)
const app = createApp(App)
// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 国际化
app.use(ElementPlus, {
  locale: zhCn,
})

// 全局注册公共组件
app.use(gloablComponent)
app.use(pinia)
app.use(router)
app.use(i18n)

// 初始化主题

initTheme(pinia)

app.mount('#app')
