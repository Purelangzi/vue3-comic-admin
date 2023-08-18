<template>
  <div>
    <svg :style="{ width, height }" class="svg-icon" aria-hidden="true">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>
<script setup lang="ts">
interface SvgProps {
  prefix?: string //xlink:href属性值的前缀
  name: string //svg矢量图的名字
  color?: string //svg图标的颜色
  width?: string //svg宽度
  height?: string //svg高度
}
withDefaults(defineProps<SvgProps>(), {
  prefix: '#icon-',
  color: 'currentColor',
  width: '1em',
  height: '1em',
})
</script>
<style lang="scss" scoped>
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
