<template>
  <my-table
    ref="myTableRef"
    v-model:dialog-visible="dialogVisible"
    v-model:page="state.searchParams.page"
    v-model:page-size="state.searchParams.pageSize"
    v-bind="tableConfig"
    :is-add="isAdd"
    @selection-change="handleSelectionChange"
    @cancel-dialog="cancelMoreUpdate"
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
      <el-row>
        <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24">
          <div class="abilityBtn">
            <el-button type="danger" icon="Delete" @click="handleMoreDelete">
              批量删除
            </el-button>
            <el-button type="danger" icon="Edit" @click="handleMoreModify">
              批量修改分类
            </el-button>
            <el-button
              type="success"
              icon="Top"
              @click="() => (state.dialogExcelVisible = true)"
            >
              导出当前视频列表
            </el-button>
            <el-button
              type="primary"
              icon="Position"
              :disabled="newChapterBtn"
              @click="mappingChapter"
            >
              一键映射剧集
            </el-button>
            <el-upload
              style="margin-left: 12px"
              action="#"
              accept=".xls,.xlsx"
              :http-request="importExcChapter"
              :show-file-list="false"
            >
              <el-button type="primary" icon="SortDown">
                一键导入当前视频列表的剧集列表
              </el-button>
            </el-upload>
          </div>
        </el-col>
        <el-col :xl="8" :lg="8" :md="0" :sm="0" :xs="0">
          <div class="log">
            <el-form :model="state.logform" ref="Searchform" :inline="false">
              <el-form-item label="执行日志">
                <el-input
                  type="textarea"
                  resize="none"
                  v-model="state.logform.data"
                  disabled
                  :rows="5"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </template>
    <!-- table插槽 -->
    <template #cover_lateral="{ scope }">
      <el-image
        :src="scope.row.cover_lateral"
        style="width: 56px; height: 56px"
        fit="fill"
        :lazy="true"
      >
        <template #error>
          <img :src="defaultList" style="width: 56px; height: 56px" />
        </template>
      </el-image>
    </template>
    <template #is_vip="{ scope }">
      <el-tag
        :type="scope.row.is_vip === 0 ? 'danger' : 'success'"
        effect="dark"
      >
        {{ scope.row.is_vip === 0 ? '收费' : '免费' }}
      </el-tag>
    </template>
    <template #operation="{ scope }">
      <el-button
        size="small"
        type="primary"
        icon="Edit"
        @click="handleEditList(scope.row)"
      >
        编辑
      </el-button>
      <el-button
        size="small"
        type="danger"
        icon="Delete"
        @click="handleDeleteList(scope.row)"
      >
        删除
      </el-button>
    </template>

    <!-- dialog对话框插槽 -->
    <template #dialogBody>
      <el-select v-model="state.selectMoreUpdateCtId" placeholder="分类名称">
        <el-option
          v-for="category in state.categoryData"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        ></el-option>
      </el-select>
    </template>
    <template #dialogFooter>
      <span class="dialog-footer">
        <el-button @click="cancelMoreUpdate">取消</el-button>
        <el-button
          type="primary"
          :disabled="!state.selectMoreUpdateCtId"
          @click="moreUpdateCategory"
        >
          确定
        </el-button>
      </span>
    </template>
  </my-table>
  <!--预览表格-->
  <el-dialog
    title="表格excel保存预览"
    width="70%"
    v-model="state.dialogExcelVisible"
  >
    <el-table :data="tableConfig.tableData" height="380px">
      <el-table-column
        v-for="(col, index) in excelTableColumns"
        :key="index"
        show-overflow-tooltip
        :prop="col.prop"
        :label="col.label"
      ></el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" @click="onExportAllCt">确定保存</el-button>
    </template>
  </el-dialog>
  <!-- 编辑 -->
  <el-dialog
    v-model="dialogEditVisible"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="65%"
    @close="closeEditDialog"
  >
    <video-edit
      :id="state.comicId"
      :cateogry-data="state.categoryData"
      @get-list="getData"
    />
  </el-dialog>
</template>
<script setup lang="ts">
import { UploadRequestOptions } from 'element-plus'
import defaultList from '@/assets/images/defaultList.jpg'
import MyTable from '@/components/Table/index.vue'
import MyForm from '@/components//Form/index.vue'

import {
  getList,
  updateList,
  deleteList,
  getCategory,
  addChapter,
} from '@/api/video'
import { queryVideoDetail } from '@/api/common'
import { ImportXlsx, exportXls } from '@/utils/excel'
import { useDateFormat } from '@vueuse/core'
import {
  searchFormConfig,
  tableConfig,
  dialogVisible,
  dialogEditVisible,
  ids,
  isAdd,
  excelTableColumns,
  newChapterBtn,
} from './data/list-data'

const VideoEdit = defineAsyncComponent(
  () => import('./component/video-edit.vue'),
)
const myTableRef = ref<InstanceType<typeof MyTable> | null>(null)
const myFormRef = ref<InstanceType<typeof MyForm> | null>(null)

const state = reactive({
  searchParams: {
    // 搜索参数
    name: '',
    page: 1,
    pageSize: 10,
  },
  selectList: [] as any[], // 已选择的多选数据，
  categoryData: [] as any[], // 分类数据

  selectMoreUpdateCtId: '', // 已选择的批量修改的分类id

  logform: {
    // 日志表单
    data: '',
  },
  dialogExcelVisible: false,

  comicId: 0, // 当前选择的漫画id，
})

onMounted(() => {
  getData()
  getCategoryData()
})

// 获取列表
const getData = async () => {
  if (!tableConfig.loading) tableConfig.loading = true
  try {
    const { data } = await getList(state.searchParams)
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
    tableConfig.loading = false
  }
}
// 获取分类
const getCategoryData = async () => {
  try {
    const { data } = await getCategory()
    state.categoryData = data.data
  } catch (error) {
    console.log(error)
  }
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
      await deleteList({ ids: id })
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

// 批量修改分类
const handleMoreModify = () => {
  dialogVisible.value = true
}
// 关闭批量修改分类对话框或取消批量修改分类
const cancelMoreUpdate = () => {
  state.selectMoreUpdateCtId = ''
  dialogVisible.value = false
}

// 确定批量修改分类
const moreUpdateCategory = () => {
  // // 循环修改当前列表数据的分类id
  tableConfig.tableData.forEach(async (el: any) => {
    el.category_id = state.selectMoreUpdateCtId
    try {
      const { msg } = await updateList(el)
      state.logform.data += `${el.name} ${msg}\n`
    } catch (error) {
      state.logform.data += '修改失败\n'
    }
  })
  ElMessage.success('当前页漫画的批量修改分类完成')
  cancelMoreUpdate()
}
// 导出当前漫画列表
const onExportAllCt = () => {
  // 定义数据对照表，想导出的列
  const dataHeader: any = {
    name: '漫画名称',
    cartoon_introduction: '简介',
    img_url: '封面',
    read: '阅读量',
    fabulous: '点赞量',
    price: '价格',
    charge: '是否收费',
  }
  const list = tableConfig.tableData.map((item) => {
    let obj = {} as any
    for (const key in item) {
      if (dataHeader[key]) {
        obj[dataHeader[key]] = item[key]
      }
    }
    return obj
  })
  exportXls('当前漫画列表', list)
  state.dialogExcelVisible = false
}

// 一键导入章节列表
const importExcChapter = async (options: UploadRequestOptions) => {
  state.logform.data = ''
  try {
    let res = await ImportXlsx(options.file)
    let head: any = {
      章节名称: 'title',
      封面: 'cover',
      章节别名: 'title_alias',
      价格: 'price',
      是否vip: 'is_vip',
      采集链接: 'url',
      上家ID: 'platform_chapter',
      上家漫画ID: 'comicId',
    }
    const list = res.map((item) => {
      let obj = {} as any
      for (const k in item) {
        if (head[k]) {
          obj[head[k]] = item[k]
        }
      }
      return obj
    })
    if (tableConfig.tableData.length == 0) {
      state.logform.data =
        `漫画信息匹配失败，请检查是否存在漫画信息\n` + state.logform.data
      return
    }

    const listLength = list.length

    for (let i = 0; i < tableConfig.tableData.length; i++) {
      const item = tableConfig.tableData[i]
      const flag = list.some((el) => el.comicId === item.platform_comic)
      if (!flag) {
        ElNotification({
          title: '警告',
          message:
            '当前导入的章节列表不属于当前漫画列表的任何一个漫画,导入失败',
          type: 'warning',
        })
        return
      }
      state.logform.data = `开始导入章节\n`
      for (let index = 0; index < list.length; index++) {
        const el = list[index]
        // 章节所属的漫画id是否等于当前漫画列表已有的十个漫画的id
        if (el.comicId == item.platform_comic) {
          // 浅拷贝,准备请求对象
          let params = { ...el }
          // 请求对象添加章节所属漫画的id并赋值
          params.comic_id = item.id
          // 删除比较的请求参数
          delete params.comicId
          const res = await addChapter(params)
          if (res.code == 200) {
            state.logform.data =
              `${index + 1}/${listLength}漫画章节导入成功\n` +
              state.logform.data
          } else {
            state.logform.data =
              `${index + 1}/${listLength}漫画章节导入失败,${res.msg}\n` +
              state.logform.data
          }
        }
      }
      state.logform.data = `第${i + 1}漫画章节导入完毕\n` + state.logform.data
    }
  } catch (error) {
    state.logform.data = `导入失败\n` + state.logform.data
  }
}

// 一键映射剧集(获取当前列表的剧集信息，然后更新当前列表的剧集)
const mappingChapter = async () => {
  if (tableConfig.tableData.length == 0) {
    state.logform.data =
      `视频信息匹配失败，请检查是否存在视频信息\n` + state.logform.data
    return
  }
  newChapterBtn.value = true
  for (let el = 0; el < tableConfig.tableData.length; el++) {
    const item = tableConfig.tableData[el]
    const params = {
      comicId: item.platform_comic,
      type: 1,
    }
    const res = await queryVideoDetail(params)
    if (res.code == 200) {
      state.logform.data = `开始上传剧集...`
      const chapterLength = res.data.length
      for (let index = 0; index < res.data.length; index++) {
        const item1 = res.data[index]
        item1.comic_id = item.id
        delete item1.platform_comic
        const res1 = await addChapter(item1)
        if (res1.code == 200) {
          state.logform.data =
            `${index + 1}/${chapterLength}导入成功\n` + state.logform.data
        } else {
          state.logform.data =
            `${index + 1}/${chapterLength}导入失败,${res1.msg}\n` +
            state.logform.data
        }
      }
    } else {
      ElMessage.error('IP限制,需要梯子')
    }
  }
  state.logform.data = `导入完成\n` + state.logform.data
  newChapterBtn.value = false
}
// 编辑列表
const handleEditList = (row: any) => {
  state.comicId = row.id
  dialogEditVisible.value = true
}
// 删除列表
const handleDeleteList = async (row: any) => {
  const { name, id } = row
  await dropMethod(id, name, myTableRef)
}
// 关闭编辑列表弹框的回调
const closeEditDialog = () => {
  dialogEditVisible.value = false
  state.comicId = 0
}

// 多选
const handleSelectionChange = (list: any[]) => {
  state.selectList = list
}
</script>
<style lang="scss" scoped>
.abilityBtn {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}
</style>
