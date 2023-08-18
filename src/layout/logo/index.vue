<template>
  <div class="logo" v-if="display">
    <img
      v-if="logoDisplay"
      :src="logoPng"
      :class="isCollapse ? 'img_collapse' : 'imgStyle'"
    />
    <p v-else :class="isCollapse ? 'title_collapse' : 'title'">
      {{ setting.title }}
    </p>
  </div>
</template>
<script setup lang="ts">
import setting from '@/setting'
import logoPng from '@/assets/logo.png'
defineProps<{
  isCollapse: boolean
  display: boolean
  logoDisplay: boolean
}>()
</script>
<style lang="scss" scoped>
.logo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: $base-menu-logo-height;
  color: var(--el-color-primary);

  .imgStyle {
    max-width: 100%;
    max-height: 100%;
  }

  .img_collapse {
    transform: scale(0.5);
  }

  .title {
    margin-top: 10px;
    font-size: $base-logo-title-fontsize;
    transition: all 0.3s;
  }

  .title_collapse {
    overflow: hidden;
    font-size: $base-logo-title-fontsize-collapse;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
