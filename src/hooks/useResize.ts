import { useLayOutSettingStore } from '../store/modules/setting'
import { useWindowSize } from '@vueuse/core'
import setting from '@/setting'
/**
 * 根据窗口的大小,侧边菜单栏自适应
 *
 */
const { width } = useWindowSize()
export default function useReisze() {
  const useSetting = useLayOutSettingStore()
  const isMobile = () => {
    // const rect = document.body.getBoundingClientRect()
    return width.value < setting.pc_device_width
  }
  const resizeHandler = () => {
    if (!document.hidden) {
      useSetting.updateDevice(isMobile() ? 'mobile' : 'desktop')
      if (isMobile()) {
        useSetting.closeSideBar(true)
      }
    }
  }

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  onMounted(() => {
    // 移动端折叠菜单
    if (isMobile()) {
      useSetting.updateDevice('mobile')
      useSetting.closeSideBar(true)
    }
  })
  return {}
}
