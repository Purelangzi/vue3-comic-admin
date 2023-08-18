<template>
  <el-drawer
    size="310"
    v-model="drawer"
    title="系统外观"
    :before-close="handleClose"
  >
    <el-row>
      <el-col :span="24">
        <p>一键主题配色</p>
      </el-col>
      <el-col :span="24" class="themes-box">
        <div
          v-for="item in themes"
          :key="item.name"
          class="theme"
          :style="{ backgroundColor: item.color }"
          @click="changeTheme(item.name)"
        ></div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="18">
        <span>自定义主题配色</span>
      </el-col>
      <el-col :span="6">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          @change="changePrimary"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <span>Logo组件</span>
      </el-col>
      <el-col :span="6">
        <el-switch
          size="large"
          v-model="useSetting.display"
          inline-prompt
          active-text="on"
          inactive-text="off"
        />
      </el-col>
    </el-row>
    <el-row v-if="useSetting.display">
      <el-col :span="18">
        <span>Logo图标</span>
      </el-col>
      <el-col :span="6">
        <el-switch
          size="large"
          v-model="useSetting.logoDisplay"
          inline-prompt
          active-text="on"
          inactive-text="off"
        />
      </el-col>
    </el-row>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">重置</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { useThemeStore, useLayOutSettingStore } from '@/store/modules/setting'
import { themes, predefineColors } from './data'
const props = defineProps<{
  drawerValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:drawerValue', val: boolean): void
}>()
const drawer = ref(props.drawerValue)

const useTheme = useThemeStore()
const useSetting = useLayOutSettingStore()
const color = ref(useTheme.elTheme[0]?.rgba || '#409eff')
// 当前颜色选择器的默认颜色
watch(
  () => useTheme.elTheme[0]?.rgba,
  (val) => {
    color.value = val ? val : '#409eff'
  },
)

// 一键主题配色
const changeTheme = (theme: string) => {
  useTheme.setScheme(theme)
}
// 自定义主题色
const changePrimary = (rgba: string | null) => {
  useTheme.setElTheme('--el-color-primary', rgba ? rgba : '')
}
const handleClose = (done: () => void) => {
  done()
  emit('update:drawerValue', !drawer.value)
}
const cancelClick = () => {
  useSetting.reestState()
  useTheme.reestState()
}
watch(
  () => props.drawerValue,
  (newVal) => {
    drawer.value = newVal
  },
)
</script>
<style lang="scss" scoped>
.themes-box {
  margin: 20px 0;

  .theme {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 40px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 20%;
  }
}

.color-scheme {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  p {
    margin-right: 20px;
  }
}

.setting {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .title {
    width: 50%;
  }
}

.el-row {
  align-items: center;
  padding-bottom: 6px;
}
</style>
