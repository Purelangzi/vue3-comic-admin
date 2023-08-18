<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import { useLocaleStore } from './store/modules/locales'
const locales = {
  zh,
  en,
}
const useLocale = useLocaleStore()
</script>

<template>
  <el-config-provider :locale="locales[useLocale.locale]">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
