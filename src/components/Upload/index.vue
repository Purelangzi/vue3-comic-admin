<template>
  <div class="my-upload">
    <el-upload
      class="avatar-uploader"
      :http-request="imgUpload"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <template #default>
        <!-- 头像上传的方式 -->
        <template v-if="avatarFlag">
          <el-image
            v-if="avatar"
            :src="avatar"
            fit="cover"
            :lazy="true"
            :style="{ width, height, display: 'block' }"
          ></el-image>
          <el-icon
            v-else
            class="avatar-uploader-icon"
            :style="{ width, height }"
          >
            <Plus />
          </el-icon>
        </template>
        <slot name="uploadBody"></slot>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          <slot name="uploadTip"></slot>
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import type { UploadProps, UploadRawFile } from 'element-plus'
import { useBase64 } from '@vueuse/core'
import { uploadFile } from '@/api/common'
interface UploadConfig {
  avatarFlag?: boolean
  width?: string
  height?: string
  avatar?: string
  fileRaw?: UploadRawFile
  upload?: boolean
}
const props = withDefaults(defineProps<UploadConfig>(), {
  avatarFlag: false,
  width: '100px',
  height: '100px',
  avatar: '',
  fileRaw: undefined,
  upload: false, // 立即上传到服务器
})
const emit = defineEmits<{
  (e: 'update:avatar', val: string): void
  (e: 'update:fileRaw', val: UploadRawFile): void
}>()

// 上传头像图片前检查，实时预览
const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const typeArr = ['image/png', 'image/jpg', 'image/jpeg']
  const flag = typeArr.includes(rawFile.type)
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!flag) {
    ElMessage.error('上传图片只能是 PNG、JPG、JPEG 格式!')
    return false
  } else if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB')
    return false
  }
  // 把File对象异步读取成base64
  const base64 = await useBase64(rawFile).promise.value
  emit('update:avatar', base64) // 实时预览
  emit('update:fileRaw', rawFile) // 发送 临时上传的头像图片数据

  // // 1.异步操作的把File对象读取成base64，实时预览
  // let fr = new FileReader()
  // fr.readAsDataURL(rawFile)
  // fr.onload = (e:any)=>{
  //   emit('update:avatar',e.target.result)
  // }
  // // 2.根据事件循环，这里会先执行
  // emit('update:fileRaw',rawFile)// 发送 临时上传的头像图片数据
  return true
}

// 上传用户头像到服务器
const imgUpload = async () => {
  if (!props.upload) return // 点确定才上传(阻止默认上传)
  const formData = new FormData() // 通过FormData对象搭载blob
  formData.append('files', props.fileRaw as UploadRawFile)
  try {
    const res = await uploadFile(formData)
    emit('update:avatar', res.data.url) // 发送 接口返回的url地址
  } catch (error) {
    ElMessage.error('上传图片失败')
  }
}

defineExpose({
  imgUpload,
})
</script>
<style lang="scss" scoped>
:deep(.avatar-uploader) {
  .el-upload {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
