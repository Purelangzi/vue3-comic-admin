<template>
  <div class="dashboard-container">
    <el-row>
      <el-col><user-detail :userInfo="useUserStore.userInfo" /></el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"><commend /></el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { useUserInfoStore } from '@/store/modules/user'
import Commend from './commend/index.vue'
import UserDetail from './user-detail/index.vue'
const useUserStore = useUserInfoStore()
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    background-color: #fff;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
