import setting from '@/setting'

export const useLayOutSettingStore = defineStore('SETTING', {
  state: () => ({
    collapse: false, // 折叠状态
    withoutAnimation: false, // 是否关闭折叠动画
    device: 'desktop', // 当前设备是pc还是mobile
    refresh: false, // 刷新状态
    display: setting.display, // logo组件显隐
    logoDisplay: setting.logoDisplay, // logo图标显隐
  }),
  actions: {
    updateCollapse() {
      this.collapse = !this.collapse
      this.withoutAnimation = false
    },
    updateDevice(val: 'desktop' | 'mobile') {
      this.device = val
    },
    updateRefresh() {
      this.refresh = true
      nextTick(() => {
        this.refresh = false
      })
    },
    // 折叠侧边菜单栏
    closeSideBar(withoutAnimation: boolean) {
      this.collapse = true
      this.withoutAnimation = withoutAnimation
    },
    updateHidden() {
      this.display = !this.display
    },
    updateLoginHidden() {
      this.logoDisplay = !this.logoDisplay
    },
    reestState() {
      this.$reset()
    },
  },
  getters: {
    getCollapse: (state) => state.collapse,
    getWithoutAnimation: (state) => state.withoutAnimation,
    getDevice: (state) => state.device,
    getRefresh: (state) => state.refresh,
    getDisplay: (state) => state.display,
    getLogoDisplay: (state) => state.logoDisplay,
  },
  persist: {
    enabled: true,
  },
})
export const useThemeStore = defineStore('THEME', {
  state: () => ({
    scheme: '',
    elTheme: [] as { elCss: string; rgba: string }[],
  }),
  actions: {
    setScheme(str: string) {
      this.scheme = str
      document.getElementsByTagName('html')[0].className = str
      this.elTheme = []
      document.querySelector('html')?.removeAttribute('style')
    },
    /**
     * 设置elPlus主题色,可设置el-color-primary之外的例如el-color-success
     * @param elCss el-color-primary等
     * @param rgba  rgba(xxx)或#409EFF
     */
    setElTheme(elCss: string, rgba: string) {
      const index = this.elTheme.findIndex((el) => el.elCss === elCss)
      if (index !== -1) {
        // 替换已存在的elCss的rgba,然后重新设置
        this.elTheme[index].rgba = rgba
        document.documentElement.style.setProperty(
          this.elTheme[index].elCss,
          rgba,
        )
      } else {
        document.documentElement.style.setProperty(elCss, rgba)
        this.elTheme.push({ elCss, rgba })
      }
      this.scheme = ''
      document.querySelector('html')?.removeAttribute('class')
    },
    reestState() {
      this.$reset()
      document.querySelector('html')?.removeAttribute('style')
      document.querySelector('html')?.removeAttribute('class')
    },
  },

  persist: {
    enabled: true,
  },
})
