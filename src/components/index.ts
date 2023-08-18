import type { App, Component } from 'vue' //协助进行类型检查和声明
import SvgIcon from './SvgIcon/index.vue'

const components: { [name: string]: Component } = { SvgIcon } // 放入一个对象中，用于遍历批量注册

// 暴露插件对象
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
  },
}
