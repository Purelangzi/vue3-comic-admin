import { Pinia } from 'pinia'
import { useThemeStore } from '@/store/modules/setting'

export default (pinia: Pinia) => {
  const useTheme = useThemeStore(pinia)
  // 如果一键配置的主题色存在
  if (useTheme.scheme) {
    useTheme.setScheme(useTheme.scheme)
  }
  // 如果自定义的主题色存在（优先级最高）
  if (useTheme.elTheme.length) {
    useTheme.elTheme.forEach((el) => {
      useTheme.setElTheme(el.elCss, el.rgba)
    })
  }
}
