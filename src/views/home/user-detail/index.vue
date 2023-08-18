<template>
  <div class="userDetail">
    <div class="userImg">
      <img :src="userInfo.avatar ? userInfo.avatar : defaultUserimg" />
    </div>
    <div class="userInfo">
      <h3>欢迎{{ userInfo && userInfo.username }},请开始你的工作吧！</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
import defaultUserimg from '@/assets/images/defaultUserImg.png'
defineProps<{
  userInfo: {
    [x: string]: any
  }
}>()
</script>
<style lang="scss" scoped>
.userDetail {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0d4d4;

  .userImg {
    margin-left: 10px;

    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
    }
  }

  .userInfo {
    margin-left: 10px;
    font-size: 16px;
    color: darkgrey;
  }
}
</style>
