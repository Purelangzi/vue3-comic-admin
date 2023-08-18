<template>
  <div class="my-table">
    <!-- 搜索区域 -->
    <div class="searchModule" v-if="searchModuleFlag">
      <el-card :body-style="{ marginTop: '15px' }">
        <!-- 搜索表单 -->
        <el-row justify="space-between">
          <slot name="searchForm"></slot>
        </el-row>
        <!-- 扩展的功能按钮 -->
        <el-row>
          <el-col :span="24">
            <div style="padding-top: 8px">
              <slot name="searchOperator"></slot>
            </div>

            <slot name="tableOperator"></slot>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        :row-style="rowStyle"
        :stripe="stripe"
        :cell-style="cellStyle"
        :height="height"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        ref="tableRef"
      >
        <!-- 多选 -->
        <template v-if="selectionFlag">
          <el-table-column type="selection" fixed="left"></el-table-column>
        </template>
        <el-table-column type="index" label="序号" width="60">
          <template #default="{ $index }">
            {{ (curPage - 1) * curPageSize + $index + 1 }}
          </template>
        </el-table-column>
        <!-- 表格列配置 -->
        <template v-for="col in tableColumns" :key="col.attr.prop">
          <el-table-column
            v-if="!col.slotName"
            v-bind="col.attr"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column v-else v-bind="col.attr" align="center">
            <template #default="scope">
              <!-- 自定义命名插槽，传入当前行数据 -->
              <slot :name="col.slotName" :scope="scope"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination" v-if="paginationFlag">
      <el-pagination
        v-model:current-page="curPage"
        v-model:page-size="curPageSize"
        :page-sizes="props.pageSizes"
        background
        layout="sizes, prev, pager, next, jumper, total"
        :total="total"
        @size-change="handlePagChange"
        @current-change="handlePagChange"
      />
    </div>
    <!-- 对话框 -->
    <div class="dialog" v-if="dialogFlag">
      <el-dialog
        :title="isAdd ? `添加${dialogTitle}` : `修改${dialogTitle}`"
        v-model="dialogShow"
        :width="dialogWidth"
        :before-close="handleDialogClose"
      >
        <slot name="dialogBody"></slot>

        <template #footer>
          <slot name="dialogFooter"></slot>
        </template>
      </el-dialog>
    </div>
    <!-- 抽屉 -->
    <div class="drawer" v-if="drawerFlag">
      <el-drawer
        v-model="drawerShow"
        :title="isAdd ? `添加${drawerTitle}` : `修改${drawerTitle}`"
        :direction="drawerDirection"
        :size="drawerSize"
        :show-close="showClose"
        :before-close="handleDrawerClose"
      >
        <template v-if="!drawerTitle" #header>
          <slot name="drawerHeader"></slot>
        </template>
        <template #default>
          <slot name="drawerBody"></slot>
        </template>
        <template #footer>
          <slot name="drawerFooter"></slot>
        </template>
      </el-drawer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CSSProperties } from 'vue'
import type { TableInstance } from 'element-plus'

interface TableType {
  searchModuleFlag?: boolean
  loading: boolean
  tableData: Array<any>
  tableColumns: Array<any>
  rowStyle?: CSSProperties
  stripe?: boolean
  cellStyle?: CSSProperties
  headerCellStyle?: CSSProperties
  height?: number | string
  selectionFlag?: boolean
  paginationFlag?: boolean
  page?: number
  pageSize?: number
  pageSizes?: number[]
  total?: number
  dialogFlag?: boolean
  dialogVisible?: boolean
  dialogTitle?: string
  dialogWidth?: string | number
  isAdd?: number
  drawerFlag?: boolean
  drawerVisible?: boolean
  drawerTitle?: string
  drawerDirection?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showClose?: boolean
  drawerSize?: number | string
}

const props = withDefaults(defineProps<TableType>(), {
  // 搜索区域配置
  searchModuleFlag: true, // 开关
  // 表格区域配置
  loading: true, // 加载效果
  tableData: () => [], // 数据
  tableColumns: () => [], // 列配置项
  rowStyle: () => ({
    // 行样式
    height: '50px',
  }),
  stripe: false, // 斑马线
  cellStyle: () => ({
    // 单元格样式
    textAlign: 'center',
  }),
  headerCellStyle: () => ({
    textAlign: 'center',
    backgroundColor: '#f5f7fa',
  }),
  height: 500, // 表格高度
  selectionFlag: true, // 多选开关
  // 分页器配置
  paginationFlag: true, // 分页器开关
  page: 1,
  pageSize: 10,
  pageSizes: () => [5, 10, 20, 30, 50],
  total: 0,
  // 对话框配置
  dialogFlag: false, // 对话框开关
  dialogVisible: false, // 显隐
  dialogTitle: '', // 标题
  dialogWidth: '30%', // 宽度
  isAdd: 1, // 添加还是修改
  // 抽屉配置
  drawerFlag: false, // 抽屉开关
  drawerShow: false, // 显隐
  drawerTitle: '', // 标题
  drawerDirection: 'rtl', //打开方向
  showClose: true, // 显示关闭按钮
  drawerSize: '30%', // 窗体的大小,
})

const emit = defineEmits<{
  (e: 'selectionChange', val: any[]): void
  (e: 'paginationChange'): void
  (e: 'handleSearch', val: any): void
  (e: 'handleReset'): void
  (e: 'update:dialogVisible', val: boolean): void
  (e: 'update:page', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'cancelDialog'): void
  (e: 'update:drawerVisible', val: boolean): void
  (e: 'cancelDrawer', val: string): void
}>()

const tableRef = ref<TableInstance>()

const curPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  },
})

const curPageSize = computed({
  get: () => props.pageSize,
  set: (val) => {
    emit('update:pageSize', val)
  },
})
const dialogShow = computed({
  get: () => props.dialogVisible,
  set: (val) => {
    emit('update:dialogVisible', val)
  },
})
const drawerShow = computed({
  get: () => props.drawerVisible,
  set: (val) => {
    emit('update:drawerVisible', val)
  },
})

const handleSelectionChange = (val: any[]) => {
  emit('selectionChange', val)
}
const handlePagChange = () => {
  emit('paginationChange')
}

const handleDialogClose = (done: () => void) => {
  done()
  emit('cancelDialog')
}
const handleDrawerClose = (done: () => void) => {
  done()
  emit('cancelDrawer', 'drawer')
}
defineExpose({
  tableRef,
})
</script>
<style lang="scss" scoped>
.table {
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
}
</style>
