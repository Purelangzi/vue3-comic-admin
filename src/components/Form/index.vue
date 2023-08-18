<template>
  <div class="my-form">
    <el-form
      :model="state.form"
      ref="formRef"
      @submit.prevent
      :rules="formRules"
      :size="size"
      :label-width="labelWidth"
      :style="{ width }"
      :inline="inline"
    >
      <el-form-item
        v-for="item in formItemColumn"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
      >
        <template #default="{ scope }">
          <template v-if="item.type === 'input'">
            <el-input
              v-model.trim="state.form[item.prop]"
              clearable
              :maxlength="item.maxlength"
              @keyup.enter="handleSubmit(formRef)"
              :placeholder="`请输入${item.label}`"
              :show-password="item.password"
            ></el-input>
          </template>
          <template v-if="item.type === 'select'">
            <el-select
              v-model="state.form[item.prop]"
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="col in item.options"
                :key="col.value"
                :label="col.label"
                :value="col.value"
              ></el-option>
            </el-select>
          </template>
          <template v-if="item.type === 'textarea'">
            <el-input
              type="textarea"
              v-model.trim="state.form[item.prop]"
              clearable
              :maxlength="item.maxlength"
              :placeholder="`请输入${item.label}`"
            ></el-input>
          </template>
          <template v-if="item.slotName">
            <slot :name="item.slotName" :scope="scope"></slot>
          </template>
        </template>
      </el-form-item>
      <!-- 默认尾部按钮 -->
      <div class="form-footer" :style="formFooterStyle" v-if="formFooterFlag">
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit(formRef)"
            :loading="formFooter.submit.loading"
          >
            {{ formFooter.submit.text }}
          </el-button>
          <el-button @click="handleCancel(formRef)">
            {{ formFooter.cancel.text }}
          </el-button>
        </el-form-item>
      </div>
      <!-- 自定义尾部 -->
      <div class="form-footer" v-else>
        <slot name="formFooter"></slot>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { FormInstance, FormRules, ElMessage } from 'element-plus'
import { CSSProperties } from 'vue'

interface FormType {
  width?: string
  formRules?: FormRules
  size?: '' | 'large' | 'default' | 'small'
  inline?: boolean
  labelWidth?: string | number
  formItemColumn?: Array<any>
  formFooterFlag?: boolean
  formFooterStyle?: CSSProperties
  formFooter?: {
    submit: {
      text: string
      loading?: boolean
    }
    cancel: {
      text: string
    }
  }
}
const props = withDefaults(defineProps<FormType>(), {
  width: '', // 表单宽度
  formRules: () => ({}), // 检验规则
  size: '', // 表单尺寸
  inline: false, // 行内表单
  labelWidth: 'auto', //标签长度度
  formItemColumn: () => [], // 配置项
  formFooterFlag: false, // 默认尾部
  formFooter: () => ({
    // 尾部配置
    submit: {
      text: '提交',
      loading: false,
    },
    cancel: {
      text: '取消',
    },
  }),
})
const emit = defineEmits<{
  (e: 'submit', val: any): void
  (e: 'cancel', val: string): void
}>()
const formRef = ref<FormInstance>()
const state = reactive({
  form: {} as {
    [x: string]: string | number
  },
}) // 千万不要在外部定义，然后引入，不然在多个地方复用组件时，数据都是一样的

const handleCancel = (formEl: FormInstance | undefined) => {
  // 不启用默认尾部时，方便父组件调用清除
  if (props.formFooterFlag) emit('cancel', 'form')

  formEl?.resetFields()
  formEl?.clearValidate()
}
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      emit('submit', state.form)
    } else {
      ElMessage.error('请检查表单是否填写正确')
    }
  })
}
defineExpose({
  state,
  formRef,
  handleSubmit,
  handleCancel,
})
</script>
<style lang="scss" scoped></style>
