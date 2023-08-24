<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <el-icon size="22" class="left-icon" @click="$emit('changeCollapse')">
        <Expand />
      </el-icon>
      <!-- 面包屑 -->
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-for="item in $route.matched"
          :key="item.path"
          v-show="item.meta.title"
          :to="{ path: item.path }"
        >
          {{ $t(`route.${item.meta.title}`) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar-right">
      <div class="dark" style="margin: 0 20px">
        <el-switch
          v-model="darkMode"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          class="mr-2"
          size="large"
          @change="toggleDark()"
          style="--el-switch-on-color: #0960bd; --el-switch-off-color: #f60"
        />
      </div>

      <el-button
        circle
        icon="Refresh"
        size="large"
        v-loading.fullscreen.lock="fullscreenLoading"
        @click="handleRefresh"
      ></el-button>
      <el-button
        circle
        icon="FullScreen"
        size="large"
        @click="$emit('changeScreenFull')"
      ></el-button>
      <el-button
        circle
        icon="Setting"
        size="large"
        @click="handleDrawer"
      ></el-button>

      <el-dropdown @command="handleCommand" class="lang">
        <span class="el-dropdown-link">
          {{ currentLan }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="lang in langs"
              :key="lang.key"
              :command="lang"
              :disabled="lang.title === currentLan"
            >
              {{ lang.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown size="large">
        <span class="el-dropdown-link">
          <img
            :src="userInfo.avatar ? userInfo.avatar : avatar"
            class="avatar"
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleOpen">
              <svg-icon name="github" />
              GitHub
            </el-dropdown-item>
            <el-dropdown-item @click="$emit('changeLogin')">
              <svg-icon name="logout" />
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import avatar from '@/assets/images/avatar.gif'
import { useDark, useToggle } from '@vueuse/core'
import { langs } from '@/locales'
import { useLocaleStore } from '@/store/modules/locales'

defineProps<{
  userInfo: {
    [x: string]: any
  }
}>()

const fullscreenLoading = ref(false)

const isDark = useDark()
const darkMode = ref(false)
darkMode.value = isDark.value
const toggleDark = useToggle(isDark)

const useLocale = useLocaleStore()

let currentLan = ref(
  langs.find((cur) => cur.key === useLocale.locale)?.title || '',
)

const handleCommand = (command: any) => {
  currentLan.value = command.title
  useLocale.setLocale(command.key)
}

const handleRefresh = () => {
  fullscreenLoading.value = true
  emit('changeRefresh')
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 1000)
}
const emit = defineEmits<{
  (e: 'changeCollapse'): void
  (e: 'changeRefresh'): void
  (e: 'changeScreenFull'): void
  (e: 'changeLogin'): void
  (e: 'changeDrawer'): void
}>()
const handleOpen = () => {
  window.open('https://github.com/Purelangzi')
}
const handleDrawer = () => {
  emit('changeDrawer')
}
</script>
<style lang="scss" scoped>
.tabbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 5px 10px;

  .tabbar-left {
    display: flex;
    align-items: center;

    .left-icon {
      padding: 0 10px;
      cursor: pointer;
    }

    .left-icon:hover {
      background-color: #f6f6f6;
    }
  }

  .tabbar-right {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 26px;
    .lang {
      margin: 0 20px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
