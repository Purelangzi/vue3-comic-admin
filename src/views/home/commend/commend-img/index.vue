<template>
  <div class="commendImg">
    <el-card>
      <template #header>
        <span>推荐</span>
        <el-button link type="primary" style="float: right; margin-right: 10px">
          更多
        </el-button>
      </template>
      <div class="commendAvatar">
        <el-card v-for="item in links" :key="item" shadow="hover">
          <el-avatar :src="item" fit="fill">
            <img :src="defaultUserimg" />
          </el-avatar>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import defaultUserimg from '@/assets/images/defaultUserImg.png'

const links = [
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042922165936346.jpeg',
  'https://inspire-cartoon.oss-cn-guangzhou.aliyuncs.com/avatar/2023042423343624172.jpeg',
]
</script>
<style lang="scss" scoped>
.commendImg {
  width: 30%;

  :deep(.el-card__header) {
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  .commendAvatar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    min-width: 512px;
    .el-card {
      display: flex;
      justify-content: center;
      width: 23.3%;
      padding: 24px;

      .el-avatar {
        width: 90px;
        height: 90px;
      }
    }
  }
}
</style>
