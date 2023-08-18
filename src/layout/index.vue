<template>
  <div class="layout_container" :class="layoutClass">
    <div
      v-if="useSetting.getDevice === 'mobile' && !useSetting.getCollapse"
      class="drawer-bg"
      @click="handleClickOutside"
    />

    <div class="layout_slider">
      <logo
        :is-collapse="useSetting.getCollapse"
        :display="useSetting.getDisplay"
        :logo-display="useSetting.getLogoDisplay"
      />
      <el-scrollbar class="scrollbar">
        <el-menu
          router
          :default-active="$route.path"
          :collapse="useSetting.getCollapse"
          unique-opened
          background-color="#2A2D34"
          text-color="#c0c4cc"
        >
          <!-- 动态生成路由菜单 -->
          <Menu :menu-list="useUserStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部 -->
    <div class="layout_tabbar">
      <tabbar
        :user-info="useUserStore.userInfo"
        @change-collapse="changeMenuCollapse"
        @change-refresh="changRefresh"
        @change-screen-full="changeScreenFull"
        @change-login="handleLogOut"
        @change-drawer="() => (drawer = true)"
      />
    </div>
    <!-- 主体内容 -->
    <div class="layout_main">
      <!-- 过度动效 -->
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <div
            :key="route.path"
            v-if="!useSetting.refresh"
            class="app-container"
          >
            <keep-alive>
              <component :is="Component" v-if="route.meta.keepAlive" />
            </keep-alive>
            <!-- <component :is="Component" v-if="!route.meta.keepAlive && !refresh " /> -->
          </div>
        </transition>
      </router-view>
    </div>
    <!-- 主题配色必须放外面 -->
    <theme-setting v-model:drawer-value="drawer" />
  </div>
</template>
<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
import ThemeSetting from './theme-setting.vue'
import { useUserInfoStore } from '@/store/modules/user'
import { useLayOutSettingStore } from '@/store/modules/setting'
import screenfull from 'screenfull'
import { useI18n } from 'vue-i18n'
import useReisze from '@/hooks/useResize'

const useUserStore = useUserInfoStore()
const useSetting = useLayOutSettingStore()

const { t } = useI18n()
const drawer = ref(false)
useReisze()
const changeMenuCollapse = () => {
  useSetting.updateCollapse()
}
const changRefresh = () => {
  useSetting.updateRefresh()
}
const changeScreenFull = () => {
  // 当前浏览器是否支持全屏
  if (!screenfull.isEnabled) {
    return false
  }
  // 进入全屏,如果已是全屏则退出全屏
  screenfull.toggle()
}
const handleLogOut = () => {
  ElMessageBox.confirm(t('common.logOutMessage'), t('common.MessageTitle'), {
    confirmButtonText: t('common.confirmButtonText'),
    cancelButtonText: t('common.cancelButtonText'),
    type: 'warning',
  })
    .then(() => {
      useUserStore.resetToken()
      location.reload()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('common.cancelMessageText'),
      })
    })
}
const handleClickOutside = () => {
  useSetting.closeSideBar(false)
}
const layoutClass = computed(() => ({
  hideSidebar: useSetting.getCollapse,
  openSidebar: !useSetting.getCollapse,
  withoutAnimation: useSetting.getWithoutAnimation,
  mobile: useSetting.getDevice === 'mobile',
}))

watch(
  () => useSetting.getDevice,
  (val) => {
    // 移动端且菜单打开下，关闭菜单
    if (val === 'mobile' && !useSetting.getCollapse) {
      useSetting.closeSideBar(false)
    }
  },
)
</script>
<style lang="scss" scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  background: #eee;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  .layout_slider {
    position: fixed;
    left: 0;
    z-index: 1000;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);

      :deep(.el-menu) {
        border-right: none;

        .el-menu-item {
          &.is-active {
            color: var(--el-color-primary);
            background-color: $base-menu-active-bg-color;
          }

          &:hover {
            // background-color: var(--el-menu-hover-bg-color) !important;
            background-color: #001528 !important;
          }
        }
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    box-sizing: border-box;
    width: calc(100% - $base-menu-width);
    min-width: 600px;
    height: $base-tabbar-height;
    background: #fff;
    transition: all 0.3s;
  }

  .layout_main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    overflow: auto;
    transition: all 0.3s;

    .fade-enter-from {
      opacity: 0;
    }

    .fade-enter-active {
      transition: all 0.3s;
    }

    .fade-enter-to {
      opacity: 1;
    }

    .app-container {
      padding: 20px;
    }
  }
}

.hideSidebar {
  .layout_slider {
    width: $base-menu-width-collapse !important;
  }

  .layout_tabbar,
  .layout_main {
    left: $base-menu-width-collapse;
    width: calc(100% - $base-menu-width-collapse);
  }
}

.mobile {
  .layout_tabbar,
  .layout_main {
    left: 0;
    width: calc(100%);
  }

  .layout_slider {
    width: $base-menu-width !important;
    transition: transform 0.28s;
  }

  &.hideSidebar {
    .layout_slider {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$base-menu-width, 0, 0);
    }
  }
}

.withoutAnimation {
  .layout_tabbar,
  .layout_main,
  .layout_slider {
    transition: none;
  }
}

.drawer-bg {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}
</style>
