import i18n from '@/locales'
export const useLocaleStore = defineStore('locale', {
  state: () => ({
    locale: i18n.global.locale.value as 'en' | 'zh',
  }),
  actions: {
    // 设置locale
    setLocale(lang: 'en' | 'zh') {
      this.locale = lang
      i18n.global.locale.value = lang
    },
    reestState() {
      this.$reset()
    },
  },
  persist: {
    enabled: true,
  },
})
