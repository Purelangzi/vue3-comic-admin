<template>
  <my-table
    ref="myTableRef"
    v-model:dialog-visible="dialogVisible"
    v-model:page="state.searchParams.page"
    v-model:page-size="state.searchParams.pageSize"
    v-bind="tableConfig"
    :is-add="isAdd"
    @selection-change="handleSelectionChange"
    @cancel-dialog="cancelDialog"
    @pagination-change="getData"
  >
    <!-- 搜索表单插槽 -->
    <template #searchForm>
      <el-col :span="12" :xs="16" :sm="16" :xl="20">
        <my-form
          ref="myFormRef"
          v-bind="formConfig"
          @submit="handleSearch"
        ></my-form>
      </el-col>
      <el-col :span="12" :xs="8" :sm="8" :xl="4">
        <div class="searchBtn">
          <el-button type="primary" icon="Search" @click="handleSearch">
            查询
          </el-button>
          <el-button icon="RefreshRight" @click="handleReset">重置</el-button>
        </div>
      </el-col>
    </template>
    <!-- 功能插槽 -->
    <template #tableOperator>
      <el-button type="primary" icon="Plus" @click="handleAddOrUpdate(1)">
        添加
      </el-button>
      <el-button type="danger" icon="Delete" @click="handleMoreDelete">
        批量删除
      </el-button>
    </template>

    <!-- table插槽 -->
    <template #cover_img="{ scope }">
      <el-image
        v-if="scope.row.cover_img"
        :src="scope.row.cover_img"
        style="width: 56px; height: 56px"
        fit="fill"
        :lazy="true"
      >
        <template #error>
          <img :src="defaultCategory" style="width: 56px; height: 56px" />
        </template>
      </el-image>
      <img v-else :src="defaultCategory" style="width: 56px; height: 56px" />
    </template>
    <template #status="{ scope }">
      <el-tag
        :type="scope.row.status === 1 ? 'success' : 'danger'"
        effect="dark"
        size="large"
      >
        {{ scope.row.status === 1 ? '上架' : '下架' }}
      </el-tag>
    </template>
    <template #operation="{ scope }">
      <el-button
        size="small"
        type="primary"
        icon="Edit"
        @click="handleAddOrUpdate(0, scope.row)"
      >
        编辑
      </el-button>
      <el-button
        size="small"
        type="danger"
        icon="Delete"
        @click="handleDeleteItem(scope.row)"
      >
        删除
      </el-button>
    </template>

    <!-- dialog对话框插槽 -->
    <template #dialogBody>
      <el-form
        :model="state.dialogForm"
        :rules="state.SearchFormRules"
        ref="dialogFormRef"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model.trim="state.dialogForm.name"
            clearable
            @keyup.enter="submitForm(isAdd, dialogFormRef)"
            placeholder="请输入添加的分类名称"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #dialogFooter>
      <span class="dialog-footer">
        <el-button @click="cancelDialog(dialogFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(isAdd, dialogFormRef)">
          {{ isAdd ? '保存' : '修改' }}
        </el-button>
      </span>
    </template>
  </my-table>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import defaultCategory from '@/assets/images/defaultCategory.jpg'
import MyTable from '@/components/Table/index.vue'
import MyForm from '@/components//Form/index.vue'

import {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/api/cartoon'

import { useDateFormat } from '@vueuse/core'
import {
  formConfig,
  tableConfig,
  dialogVisible,
  ids,
  isAdd,
  dialogFormRef,
} from './data/category-data'

const validateName = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('不能为空'))
  } else {
    const flag = tableConfig.tableData.some(
      (el) => el.name === state.dialogForm.name,
    )
    if (flag) {
      callback(new Error('分类名称重复！'))
      return
    }
    callback()
  }
}

const myTableRef = ref<InstanceType<typeof MyTable> | null>(null)
const myFormRef = ref<InstanceType<typeof MyForm> | null>(null)

const state = reactive({
  SearchFormRules: {
    name: [{ validator: validateName, trigger: 'blur' }],
  },
  searchParams: {
    // 搜索参数
    name: '',
    page: 1,
    pageSize: 10,
  },
  selectList: [] as any[], // 已选择的多选数据，
  dialogForm: {
    // 对话框表单
    name: '',
    id: '',
    parent_id: 0,
  },
})

onMounted(() => {
  getData()
})

// 获取分类数据
const getData = async () => {
  if (!tableConfig.loading) tableConfig.loading = true
  try {
    const { data } = await getCategory(state.searchParams)
    // 解决查询时，接口total返回的是全部列表的个数
    tableConfig!.total = !state.searchParams.name ? data.total : 1
    tableConfig.tableData = data.data
    tableConfig.tableData.forEach((el) => {
      el.create_time = useDateFormat(el.create_time, 'YYYY-MM-DD HH:mm:ss')
      el.update_time = useDateFormat(
        el?.update_time || new Date(),
        'YYYY-MM-DD HH:mm:ss',
      )
    })
    tableConfig.loading = false
  } catch (error) {
    console.log(error)
    tableConfig.loading = false
  }
}
// 删除分类
const handleDeleteItem = async (row: any) => {
  const { name, id } = row
  await dropMethod(id, name, myTableRef)
}
// 批量删除分类
const handleMoreDelete = () => {
  if (!state.selectList.length) {
    ElMessage.warning('请在下面选择要删除的数据')
    return
  }
  ids.value = state.selectList.map((el) => el.id).join(',')
  dropMethod(ids.value, undefined, myTableRef)
}
// 执行删除的操作
const dropMethod = async (
  id: string | number,
  name?: string,
  ref?: Ref<InstanceType<typeof MyTable> | null>,
) => {
  await ElMessageBox.confirm(
    `确定要${name ? '删除 ' + name : '批量删除'} 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      await deleteCategory({ ids: id })
      ElMessage.success('删除成功')
      if (tableConfig.tableData.length <= 1) {
        if (state.searchParams.page === 1) return
        state.searchParams.page = state.searchParams.page - 1
      }
      // // 删除后的总条数
      // const totalNum = (tableConfig.total as number) - (state.selectList.length?state.selectList.length:1)
      // // 删除后的总页数
      // const totalPage = Math.ceil( totalNum / state.searchParams.pageSize)
      // // 当前页数大于删除后的总页数，代表已删除当前页的最后一条数据，则跳回总页数（也就是上一页）
      // state.searchParams.page = state.searchParams.page > totalPage?totalPage :state.searchParams.page
      // // 当前页数小于0时为1，也就是删除了列表的最后一条数据
      // state.searchParams.page = state.searchParams.page < 1 ? 1: state.searchParams.page
      getData()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
      ids.value = ''
      if (state.selectList.length) {
        ref?.value?.tableRef?.clearSelection()
      }
    })
}
const handleSelectionChange = (list: any[]) => {
  state.selectList = list
}

// 搜索
const handleSearch = async (formData?: any) => {
  // 考虑回车的情况
  if (formData.name) {
    state.searchParams.name = formData.name as string
    getData()
    return
  }
  await myFormRef?.value?.formRef?.validate((valid) => {
    if (valid) {
      state.searchParams.name = myFormRef?.value?.state.form.name as string
      state.searchParams.page = 1
      state.searchParams.pageSize = 10
      getData()
    } else {
      ElMessage.error('请检查表单是否填写正确')
    }
  })
}
// 重置
const handleReset = () => {
  myFormRef?.value?.handleCancel(myFormRef?.value.formRef)
  state.searchParams.name = ''
  state.searchParams.page = 1
  state.searchParams.pageSize = 10
  nextTick(() => {
    getData()
  })
}
// 添加或编辑
const handleAddOrUpdate = (val: number, row?: any) => {
  if (val === 0) {
    // 修改则回显
    state.dialogForm.name = row.name
    state.dialogForm.id = row.id
    state.dialogForm.parent_id = row.parent_id
  }
  isAdd.value = val
  dialogVisible.value = true
}
const cancelDialog = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false
  state.dialogForm.name = ''
  state.dialogForm.id = ''
  state.dialogForm.parent_id = 0
  if (!formEl) {
    dialogFormRef.value?.clearValidate()
    return
  }
  formEl?.clearValidate()
}
const submitForm = async (val: number, formEl: FormInstance | undefined) => {
  await formEl?.validate(async (valid, fields) => {
    if (valid) {
      if (val === 1) {
        // 添加
        const params = {
          name: state.dialogForm.name,
          parent_id: state.dialogForm.parent_id,
        }
        await addCategory(params)
        const max = Math.ceil(
          ++(tableConfig.total as number) / state.searchParams.pageSize,
        )
        // 跳转最后一页
        state.searchParams.page = max
        ElMessage.success('添加成功')
      } else {
        await updateCategory(state.dialogForm)
        ElMessage.success('修改成功')
      }
      cancelDialog(formEl)
      getData()
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style lang="scss" scoped></style>
