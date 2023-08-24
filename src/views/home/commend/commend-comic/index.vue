<template>
  <div class="commendCartoon">
    <el-card shadow="always" :body-style="{ padding: '0px' }">
      <template #header>
        <div>
          <span>推荐</span>
          <el-button link type="primary" class="more" @click="getMore">
            更多
          </el-button>
        </div>
      </template>
      <div class="cartoonContent" v-loading="loading">
        <comic-cart
          v-for="cartData in cartoonData"
          :key="cartData.id"
          :cartData="cartData"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import ComicCart from './comic-cart/index.vue'
defineProps<{
  cartoonData: any[]
}>()
const emit = defineEmits<{
  (e: 'getMore'): void
}>()
const loading = ref(true)
const getMore = () => {
  emit('getMore')
  loading.value = true
}
defineExpose({
  loading,
})
</script>
<style lang="scss" scoped>
.commendCartoon {
  width: 70%;
  margin-right: 10px;

  .more {
    float: right;
    margin-right: 10px;
  }

  :deep(.el-card__header) {
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .cartoonContent {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 436px;
    :deep(.el-card) {
      margin-right: 0;
    }
  }
}
</style>
