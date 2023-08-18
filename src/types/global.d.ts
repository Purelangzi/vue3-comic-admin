import SvgIcon from '@/components/SvgIcon/index.vue'

// 全局注册的组件没有类型提示,解决办法
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}
