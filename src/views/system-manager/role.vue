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
        新增角色
      </el-button>
      <el-button type="danger" icon="Delete" @click="handleMoreDelete">
        批量删除
      </el-button>
    </template>

    <!-- table插槽 -->
    <template #role_status="{ scope }">
      <el-switch
        v-model="scope.row.role_status"
        inline-prompt
        active-text="已启用"
        inactive-text="已禁用"
        @change="roleStatusChange(scope.$index)"
      ></el-switch>
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
          <template #switchSlot>
            <el-switch
              v-model="state.drawerForm.role_status"
              inline-prompt
              active-text="已启用"
              inactive-text="已禁用"
            />
          </template>
          <template #treeSlot>
            <el-tree
              v-if="isAdd"
              ref="treeRef"
              :data="state.menus"
              show-checkbox
              highlight-current
              node-key="id"
              :props="defaultProps"
              @check-change="treeChange"
            />
            <el-tree
              v-else
              ref="treeRef"
              :data="state.menus"
              show-checkbox
              highlight-current
              node-key="id"
              :default-checked-keys="state.menusId"
              :props="defaultProps"
              @check-change="treeChange"
            />
          </template>
        </my-form>
      </div>
    </template>
  </my-table>
</template>

<script setup lang="ts">
import { ElMessage, ElTree } from 'element-plus'

import { useDateFormat } from '@vueuse/core'
import { getRole, addRole, editRole, deleteRole } from '@/api/system'

import {
  searchFormConfig,
  drawerFormConfig,
  tableConfig,
  ids,
  drawerVisible,
  isAdd,
} from './data/role-data'

import MyTable from '@/components/Table/index.vue'
import MyForm from '@/components//Form/index.vue'
import { useUserInfoStore } from '@/store/modules/user'
import { RouteRecordRaw } from 'vue-router'

const myTableRef = ref<InstanceType<typeof MyTable> | null>(null)
const myFormRef = ref<InstanceType<typeof MyForm> | null>(null)
const myFormDrawerRef = ref<InstanceType<typeof MyForm> | null>(null)
const treeRef = ref<InstanceType<typeof ElTree>>()

const useUserInfo = useUserInfoStore()
const state = reactive({
  searchParams: {
    // 搜索参数
    role_name: '',
    page: 1,
    pageSize: 10,
  },
  selectList: [] as any[], // 已选择的多选数据，
  drawerForm: {
    // 抽屉表单,要提交的表单数据,用来合并row传递过来的数据
    role_status: true as boolean | number, // 状态 0 启用 1 禁用
    menus: '', //菜单id（'1','4',6')
  },
  menus: [] as RouteRecordRaw[], //本地菜单数据
  menusId: [] as number[], // 选中的菜单id
})
const defaultProps = {
  children: 'children',
  label: 'name',
}

onMounted(() => {
  getData()
  state.menus = useUserInfo.getServerMenu
})

// 获取列表
const getData = async () => {
  if (!tableConfig.loading) tableConfig.loading = true
  try {
    const { data } = await getRole(state.searchParams)
    // 解决查询时，接口total返回的是全部列表的个数
    tableConfig!.total = !state.searchParams.role_name ? data.total : 1
    tableConfig.tableData = data.data
    tableConfig.tableData.forEach((el) => {
      el.create_time = useDateFormat(el.create_time, 'YYYY-MM-DD HH:mm:ss')
      el.update_time = useDateFormat(
        el?.update_time || new Date(),
        'YYYY-MM-DD HH:mm:ss',
      )
      el.role_status = el.role_status === 0 ? true : false
    })
    tableConfig.loading = false
  } catch (error) {
    console.log(error)
    tableConfig.loading = false
  }
}
// 单个删除
const handleDeleteItem = async (row: any) => {
  const { role_name, id } = row
  await dropMethod(id, role_name, myTableRef)
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
      await deleteRole({ ids: id })
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
// switch开关，角色状态改变
const roleStatusChange = async (index: number) => {
  let {
    id,
    role_name,
    role_status,
  }: { id: number; role_name: string; role_status: boolean } =
    tableConfig.tableData[index]

  const params = {
    id,
    role_name,
    role_status: role_status ? 0 : 1,
  }
  await editRole(params)
  await getData()
}
const handleSelectionChange = (list: any[]) => {
  state.selectList = list
}
// 搜索
const handleSearch = async (formData?: any) => {
  // 考虑回车的情况
  if (formData.role_name) {
    state.searchParams.role_name = formData.role_name as string
    getData()
    return
  }
  await myFormRef?.value?.formRef?.validate((valid) => {
    const { role_name } = myFormRef?.value?.state.form as { role_name: string }
    if (valid && role_name) {
      state.searchParams.role_name = role_name
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
  state.searchParams.role_name = ''
  state.searchParams.page = 1
  state.searchParams.pageSize = 10
  nextTick(() => {
    getData()
  })
}

// 添加或修改
const handleAddOrUpdate = async (val: number, row?: any) => {
  isAdd.value = val
  drawerVisible.value = true
  // 修改
  if (val === 0) {
    // drawerVisible修改后，myFormDrawerRef才存在，异步更新dom机制使用nextTick，回显
    await nextTick(() => {
      myFormDrawerRef.value!.state.form.role_name = row.role_name
      myFormDrawerRef.value!.state.form.role_value = row.role_value
      myFormDrawerRef.value!.state.form.remark = row.remark
      myFormDrawerRef.value!.state.form.id = row.id
      // "12,13,14" ==>['12', '13', '14']
      state.menusId = row.menus.split(',')
      state.drawerForm.role_status = row.role_status
    })
  }
}

// 角色表单的菜单分配
const treeChange = () => {
  // 被选中的节点的 key 所组成的数组
  state.menusId = treeRef.value?.getCheckedKeys() as number[]
}

// 表单取消按钮或抽屉关闭的回调
const cancelDrawer = (tag: string) => {
  // 抽屉关闭
  if (tag === 'drawer') {
    myFormDrawerRef.value?.formRef?.resetFields()
    myFormDrawerRef.value?.formRef?.clearValidate()
  }
  drawerVisible.value = false
  treeRef.value?.setCheckedKeys([])
  state.drawerForm.role_status = true
  state.menusId = []
}
// 提交表单
const submitAddOrUpdate = async (form: any) => {
  drawerFormConfig!.formFooter!.submit.loading = true
  state.drawerForm = form
  state.drawerForm.role_status = state.drawerForm.role_status ? 0 : 1
  // ['12', '13', '14']==>"12,13,14"
  state.drawerForm.menus = state.menusId.join()
  // 添加
  if (isAdd.value === 1) {
    await addRole(state.drawerForm as any)
    const max = Math.ceil(
      ++(tableConfig.total as number) / state.searchParams.pageSize,
    )
    // 跳转最后一页
    state.searchParams.page = max
    ElMessage.success('添加成功')
  } else {
    await editRole(state.drawerForm as any)
    ElMessage.success('修改成功')
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
