<template>
  <my-table
    ref="myTableRef"
    v-model:drawer-visible="drawerVisible"
    v-model:page="state.searchParams.page"
    v-model:page-size="state.searchParams.pageSize"
    v-bind="tableConfig"
    :is-add="isAdd"
    @selection-change="handleSelectionChange"
    @cancel-drawer="cancelDrawer"
    @pagination-change="getData"
  >
    <!-- 搜索表单插槽 -->
    <template #searchForm>
      <el-col :span="12" :xs="16" :sm="16" :xl="20">
        <my-form
          ref="myFormRef"
          v-bind="searchFormConfig"
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
        新增账号
      </el-button>
      <el-button type="danger" icon="Delete" @click="handleMoreDelete">
        批量删除
      </el-button>
    </template>

    <!-- table插槽 -->
    <template #role_id="{ scope }">
      <el-tag v-if="scope.row.role_id === 1">超级管理员</el-tag>
      <el-tag v-else-if="scope.row.role_id === 3" type="success">管理员</el-tag>
      <el-tag v-else-if="scope.row.role_id === 6" type="info">小说用户</el-tag>
      <el-tag v-else-if="scope.row.role_id === 5" type="danger">
        视频用户
      </el-tag>
      <el-tag v-else type="warning">漫画用户</el-tag>
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

    <!-- drawer抽屉插槽 -->
    <template #drawerBody>
      <div class="drawerForm">
        <my-form
          ref="myFormDrawerRef"
          v-bind="drawerFormConfig"
          @submit="submitAddOrUpdate"
          @cancel="cancelDrawer"
        >
          <template #uploadSlot>
            <my-upload
              ref="uploadRef"
              v-bind="uploadConfig"
              :upload="state.upload"
              v-model:avatar="state.drawerForm.avatar"
              v-model:file-raw="state.avatarFileRaw"
            ></my-upload>
          </template>
        </my-form>
      </div>
    </template>
  </my-table>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'

import { useDateFormat } from '@vueuse/core'
import {
  getAccount,
  addAccount,
  editAccount,
  deleteAccount,
} from '@/api/system'

import {
  searchFormConfig,
  drawerFormConfig,
  tableConfig,
  ids,
  drawerVisible,
  isAdd,
  uploadConfig,
} from './data/account-data'
import { useUserInfoStore } from '@/store/modules/user'
import MyTable from '@/components/Table/index.vue'
import MyForm from '@/components//Form/index.vue'
import MyUpload from '@/components/Upload/index.vue'

const myTableRef = ref<InstanceType<typeof MyTable> | null>(null)
const myFormRef = ref<InstanceType<typeof MyForm> | null>(null)
const myFormDrawerRef = ref<InstanceType<typeof MyForm> | null>(null)
const uploadRef = ref<InstanceType<typeof MyUpload> | null>(null)

const userStore = useUserInfoStore()
const state = reactive({
  searchParams: {
    // 搜索参数
    username: '',
    phone: '',
    page: 1,
    pageSize: 10,
  },
  selectList: [] as any[], // 已选择的多选数据，
  drawerForm: {
    // 抽屉表单,要提交的表单数据
    avatar: '',
  },
  avatarFileRaw: undefined, // 临时上传的用户头像数据
  upload: false, // 控制是否上传到服务器
})

onMounted(() => {
  getData()
})

// 获取列表
const getData = async () => {
  if (!tableConfig.loading) tableConfig.loading = true
  try {
    const { data } = await getAccount(state.searchParams)
    // 解决查询时，接口total返回的是全部列表的个数
    tableConfig!.total = data.data.length !== 1 ? data.total : 1
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
// 单个删除
const handleDeleteItem = async (row: any) => {
  const { username, id } = row
  await dropMethod(id, username, myTableRef)
}
// 批量删除
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
      await deleteAccount({ ids: id })
      ElMessage.success('删除成功')
      if (tableConfig.tableData.length <= 1) {
        if (state.searchParams.page === 1) return
        state.searchParams.page = state.searchParams.page - 1
      }
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
  if (formData.username || formData.phone) {
    state.searchParams.username = formData?.username as string
    state.searchParams.phone = formData?.phone as string
    getData()
    return
  }
  await myFormRef?.value?.formRef?.validate((valid) => {
    const { username, phone } = myFormRef?.value?.state.form as {
      username: string
      phone: string
    }
    if ((valid && username) || phone) {
      state.searchParams.username = username
      state.searchParams.phone = phone
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
  state.searchParams.username = ''
  state.searchParams.phone = ''
  state.searchParams.page = 1
  state.searchParams.pageSize = 10
  nextTick(() => {
    getData()
  })
}

// 添加或编辑
const handleAddOrUpdate = async (val: number, row?: any) => {
  isAdd.value = val
  drawerVisible.value = true
  if (val === 0) {
    // drawerVisible修改后，myFormDrawerRef才存在，异步更新dom机制使用nextTick，修改则回显
    await nextTick(() => {
      myFormDrawerRef.value!.state.form.username = row.username
      myFormDrawerRef.value!.state.form.password = row.password
      myFormDrawerRef.value!.state.form.phone = row.phone
      myFormDrawerRef.value!.state.form.email = row.email
      myFormDrawerRef.value!.state.form.avatar = row.avatar
      myFormDrawerRef.value!.state.form.id = row.id
      myFormDrawerRef.value!.state.form.role_id = row.role_id
    })
    state.drawerForm.avatar = row.avatar
  }
}
// 表单取消按钮或抽屉关闭的回调
const cancelDrawer = (tag: string) => {
  // 抽屉关闭
  if (tag === 'drawer') {
    myFormDrawerRef.value?.formRef?.resetFields()
    myFormDrawerRef.value?.formRef?.clearValidate()
  }
  drawerVisible.value = false
  state.drawerForm = reactive({
    avatar: '',
  })
  state.avatarFileRaw = undefined
  state.upload = false
}
// 提交表单
const submitAddOrUpdate = async (form: any) => {
  drawerFormConfig!.formFooter!.submit.loading = true
  state.drawerForm = form
  // 有临时上传的文件数据才上传到服务器
  if (state.avatarFileRaw) {
    state.upload = true
    // 修改数据不会立即更新，使用nextTick，又因为nextTick也是异步，所以await
    await nextTick(async () => {
      await uploadRef?.value?.imgUpload()
    })
  }
  if (isAdd.value === 1) {
    // 添加
    await addAccount(state.drawerForm as any)
    const max = Math.ceil(
      ++(tableConfig.total as number) / state.searchParams.pageSize,
    )
    // 跳转最后一页
    state.searchParams.page = max
    ElMessage.success('添加成功')
  } else {
    await editAccount(state.drawerForm as any)
    const phone = userStore.getPhone
    if ((state.drawerForm as any).phone === phone) {
      ElNotification.warning('修改了当前账号的信息，将重新登录')
      setTimeout(() => {
        userStore.resetToken()
        location.reload()
      }, 2000)
    } else {
      ElMessage.success('修改成功')
    }
  }
  drawerFormConfig!.formFooter!.submit.loading = false
  cancelDrawer('drawer')
  getData()
}
</script>
<style lang="scss" scoped>
.drawerForm {
  padding-left: 15px;
}
</style>
