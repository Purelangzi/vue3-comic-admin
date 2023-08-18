<template>
  <template v-for="item in (menuList as any[])" :key="item.path">
    <!-- 针对首页，有子路由且只有一个时，显示子路由 -->
    <template v-if="item.name === 'layout'">
      <el-menu-item
        v-if="!item.children[0].meta?.hidden"
        :index="item.children[0].path"
      >
        <svg-icon :name="item.children[0].meta.svg" />
        <template #title>
          <span>{{ $t(`route.${item.children[0].meta.title}`) }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有子路由且个数大于一个 -->
    <template v-else-if="item.children && item.children.length >= 1">
      <el-sub-menu :index="item.path">
        <template #title>
          <svg-icon :name="item.svg" />
          <span>{{ $t(`route.${item.name}`) }}</span>
        </template>
        <!-- 递归组件 -->
        <menu-component :menu-list="item.children" />
      </el-sub-menu>
    </template>
    <!-- 没有子路由 -->
    <template v-else>
      <el-menu-item v-if="!item.meta?.hidden" :index="item.path">
        <template #title>
          <svg-icon :name="item.svg" />
          <span>{{ $t(`route.${item.name}`) }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

defineProps<{
  menuList: RouteRecordRaw[]
}>()
</script>
<script lang="ts">
// 递归组件
export default {
  name: 'MenuComponent',
}
</script>
<style lang="scss" scoped></style>
