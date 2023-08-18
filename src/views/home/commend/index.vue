<template>
  <div class="commend">
    <commend-comic
      :cartoonData="state.cartoonData"
      ref="comicRef"
      @get-more="getMore"
    />
    <commend-img />
  </div>
</template>
<script setup lang="ts">
import CommendComic from './commend-comic/index.vue'
import CommendImg from './commend-img/index.vue'
import { getCartoonList } from '@/api/home'

import { useDateFormat } from '@vueuse/core'
const comicRef = ref<InstanceType<typeof CommendComic>>()
const state = reactive({
  page: 0,
  pageSize: 9,
  cartoonData: [] as any[],
})
onMounted(() => {
  getCommendData()
})
const getCommendData = async () => {
  state.page = Math.floor(Math.random() * 69) + 1
  const { data } = await getCartoonList({
    page: state.page,
    pageSize: state.pageSize,
  })
  setTimeout(() => {
    comicRef.value!.loading = false
    state.cartoonData = data.data
    state.cartoonData.forEach((el) => {
      el.update_time = useDateFormat(
        el?.update_time || new Date(),
        'YYYY-MM-DD HH:mm:ss',
      )
    })
  }, 500)
}
const getMore = () => {
  getCommendData()
}
</script>
<style lang="scss" scoped>
.commend {
  display: flex;
  margin-top: 10px;

  :deep(.el-card__header) {
    padding: 20px;
  }
}
</style>
