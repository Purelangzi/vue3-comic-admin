<template>
  <div class="cartoonCart">
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <div class="smallImg">
        <el-image :src="cartData.img_url" fit="cover"></el-image>
      </div>
      <div class="cartoonInfo">
        <p>漫画名：{{ cartData.name }}</p>
        <p class="date">更新时间：{{ cartData.update_time }}</p>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  cartData: any
}>()
</script>
<style lang="scss" scoped>
.cartoonCart {
  width: 33.3%;

  :deep(.el-card__body) {
    display: flex;
  }

  .smallImg {
    margin-right: 5px;

    .el-image {
      width: 100px;
      height: 100px;
    }
  }

  .cartoonInfo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 12px;

    .date {
      line-height: 20px;
    }
  }
}
</style>
