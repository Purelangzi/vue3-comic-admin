<template>
  <div class="edit">
    <el-tabs v-model="state.activeName">
      <el-tab-pane v-loading="loading" label="漫画详情" name="first">
        <div class="editContent">
          <el-row>
            <el-col :span="8" :xl="6" :lg="10" :md="0" :sm="0" :xs="0">
              <el-image
                :src="state.editForm.img_url"
                fit="fill"
                class="detailImg"
              ></el-image>
            </el-col>
            <el-col :span="16" :xl="18" :lg="14" :md="24" :sm="24" :xs="24">
              <div class="dataRight">
                <h1>{{ state.editForm.name }}</h1>
                <div class="author">
                  <span>作者：{{ state.editForm.author }}</span>
                </div>
                <div class="author">
                  <span>分类：</span>
                  <el-select v-model="state.editForm.category_id" size="small">
                    <el-option
                      v-for="item in (cateogryData as any)"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="status">
                  <div class="text">
                    <span>阅读量:</span>
                    <el-input
                      v-model="state.editForm.read"
                      class="inputText"
                      size="small"
                    ></el-input>
                  </div>
                  <div class="text">
                    <span>点赞量:</span>
                    <el-input
                      v-model="state.editForm.fabulous"
                      class="inputText"
                      size="small"
                    ></el-input>
                  </div>
                  <div class="text">
                    <span>是否收费:</span>
                    <el-select
                      v-model="state.editForm.charge"
                      class="inputText"
                      size="small"
                    >
                      <el-option
                        v-for="item in chargeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="text" v-if="state.editForm.charge === 1">
                    <span>价格</span>
                    <el-input
                      v-model="state.editForm.price"
                      class="inputText"
                      size="small"
                    ></el-input>
                  </div>
                </div>
                <div class="introduce">
                  <span>简介：</span>
                  <el-input
                    type="textarea"
                    v-model="state.editForm.cartoon_introduction"
                    :rows="4"
                    placeholder="请输入简介内容"
                  ></el-input>
                </div>
                <div class="handler">
                  <el-button
                    type="success"
                    size="large"
                    round
                    @click="saveDetail"
                    style="margin-right: 30px"
                  >
                    保存漫画
                  </el-button>
                  <my-upload
                    ref="uploadRef"
                    :upload="state.eidtUpload"
                    v-model:avatar="state.editForm.img_url"
                    v-model:file-raw="state.editFileRaw"
                  >
                    <template #uploadBody>
                      <el-button type="primary" size="large" round>
                        选择封面
                      </el-button>
                    </template>
                  </my-upload>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="添加章节" name="second">
        <div class="chapterContainer">
          <my-upload
            ref="uploadRef"
            v-bind="uploadConfig"
            :upload="state.chapterUpload"
            v-model:avatar="state.chapterForm.cover"
            v-model:file-raw="state.chapterFileRaw"
          >
            <template #uploadTip>只能上传jpg/png/jpeg图片,且不超过2M</template>
          </my-upload>
          <el-form
            :model="state.chapterForm"
            ref="chapterFormRef"
            :rules="chapterRules"
            label-width="80px"
            :inline="true"
            class="chapterForm"
          >
            <el-form-item label="章节名称" prop="title">
              <el-input
                v-model="state.chapterForm.title"
                placeholder="请输入章节名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="章节别名" prop="title_alias">
              <el-input
                v-model="state.chapterForm.title_alias"
                type="number"
                :min="1"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否付费">
              <el-select v-model="state.chapterForm.is_vip" class="inputText">
                <el-option
                  v-for="item in chargeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="state.chapterForm.is_vip == 1"
              label="价格"
              prop="price"
            >
              <el-input v-model="state.chapterForm.price"></el-input>
            </el-form-item>
            <div class="saveAndImport">
              <el-button
                type="primary"
                @click="onSaveChapter"
                style="margin-right: 15px"
              >
                保存章节
              </el-button>
              <el-upload
                action="#"
                accept=".xls,.xlsx"
                :http-request="importExcChapter"
                :show-file-list="false"
              >
                <el-button type="success" icon="Bottom">批量导入章节</el-button>
              </el-upload>
            </div>
          </el-form>
          <div class="log">
            <span>执行日志</span>
            <el-input
              type="textarea"
              resize="none"
              v-model="state.logData"
              disabled
              :rows="5"
            ></el-input>
          </div>
        </div>
      </el-tab-pane>

      <!-- 连载 -->
      <div class="chapterList" v-if="state.chapterList.length">
        <div class="chapterTitle">
          <div class="series">
            <span class="seriesTitle">连载</span>
            <span class="seriesDate">{{ state.update_time }}</span>
          </div>
          <div class="flashBack">
            <span @click="flashBack">
              {{ state.isFlashBack ? '倒叙' : '顺叙' }}
            </span>
          </div>
        </div>
        <div class="chapterContent">
          <span v-for="item in state.chapterList" :key="item.chapter_id">
            {{ item.title }}
          </span>
        </div>
      </div>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, UploadRequestOptions, FormInstance } from 'element-plus'
import type { FormRules } from 'element-plus'
import { loading, chargeArr, uploadConfig } from './edit-data'
import {
  getDetail,
  getChapterList,
  updateList,
  addChapter,
} from '@/api/cartoon'
import MyUpload from '@/components/Upload/index.vue'
import { useDateFormat } from '@vueuse/core'
import { ImportXlsx } from '@/utils/excel'

const uploadRef = ref<InstanceType<typeof MyUpload> | null>(null)
const chapterFormRef = ref<FormInstance>()
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  cateogryData: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits<{
  (e: 'getList'): void
}>()
const state = reactive({
  activeName: 'first',
  // 漫画id
  id: undefined,
  // 漫画详情表单
  editForm: {
    img_url: '',
    name: '',
    author: '',
    read: 0,
    fabulous: 0,
    charge: 0,
    price: 0,
    cartoon_introduction: '',
    category_id: 0,
  },
  update_time: '',
  // 漫画章节列表
  chapterList: [] as any[],
  // 倒叙还是顺序
  isFlashBack: true,
  // chapterImg:'',
  chapterForm: {
    comic_id: props.id, // 漫画id,父级id
    cover: '', // 封面
    title: '', // 章节名称
    title_alias: 1, // 章节别名
    is_vip: 0, // 是否付费0/1
    price: 0,
  },
  logData: '',

  editFileRaw: undefined, // 临时上传的详情封面数据
  eidtUpload: false, // 控制是否上传到服务器
  chapterFileRaw: undefined, // 临时上传的章节封面数据
  chapterUpload: false, // 控制是否上传到服务器
})

const chapterRules = reactive<FormRules>({
  title: [{ required: true, message: '章节名称不能为空', trigger: 'blur' }],
  title_alias: [
    { required: true, message: '章节别名不能为空', trigger: 'blur' },
  ],
})
onMounted(() => {
  reqDetail()
  reqChapter()
})

const reqDetail = async () => {
  loading.value = true
  if (!props.id) return
  // 根据id获取漫画详情
  const res = await getDetail({ id: props.id })
  if (res.code == 200) {
    state.editForm = res.data
  }
  loading.value = false
}
const reqChapter = async () => {
  if (!props.id) return
  // 根据id获取漫画章节列表
  const { code, data } = await getChapterList({
    comic_id: props.id,
    isAll: true,
  })
  if (code == 200) {
    if (data.data.length) {
      state.chapterList = data.data
      // @ts-expect-error 忽略类型
      let time = state.editForm.update_time
        ? // @ts-expect-error 忽略类型
          state.editForm.update_time
        : data.data[data.data.length - 1].create_time
      state.update_time = useDateFormat(time, 'YYYY-MM-DD HH:mm:ss').value
    }
  }
}

// // 保存漫画
const saveDetail = async () => {
  // 有临时上传的文件数据才上传到服务器
  if (state.editFileRaw) {
    state.eidtUpload = true
    // 修改数据不会立即更新，使用nextTick，又因为nextTick也是异步，所以await
    await nextTick(async () => {
      await uploadRef?.value?.imgUpload()
    })
  }
  const { code, msg } = await updateList(state.editForm as any)
  if (code === 200) {
    ElMessage.success(msg)
    emit('getList')
  } else {
    ElMessage.error(msg)
  }
}

//保存章节
const onSaveChapter = () => {
  chapterFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 已上传封面，才确定上传小说封面到服务器
      if (!state.chapterFileRaw) {
        return ElMessage.warning('请上传小说封面！')
      }
      state.chapterUpload = true
      await nextTick(async () => {
        await uploadRef?.value?.imgUpload()
      })
      const { code, msg } = await addChapter(state.chapterForm)
      if (code == 200) {
        ElMessage.success(`${msg}`)
        reqChapter()
        // 不请求详情数据，保留详情临时上传的图片数据，因为请求详情会引起详情封面的重置
        if (state.editFileRaw) return
        reqDetail()
      } else {
        ElMessage.error(`${msg}`)
      }
    }
  })
}
// 批量导入章节
const importExcChapter = async (options: UploadRequestOptions) => {
  state.logData = ''
  try {
    let res = await ImportXlsx(options.file)
    let head: any = {
      章节名称: 'title',
      封面: 'cover',
      章节别名: 'title_alias',
      价格: 'price',
      是否vip: 'is_vip',
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
    const listLength = list.length
    // @ts-expect-error 忽略类型
    if (list[0].comicId !== state.editForm.platform_comic) {
      ElMessage.warning(
        `当前要批量导入的章节不属于 ${state.editForm.name} 漫画`,
      )
      return
    }

    for (let i = 0; i < listLength; i++) {
      const item = list[i]
      // 浅拷贝,准备请求对象
      let params = { ...item }
      // 请求对象添加章节所属漫画的id并赋值
      params.comic_id = state.id
      // 删除比较的请求参数
      delete params.comicId
      const res = await addChapter(params)
      if (res.code == 200) {
        state.logData = `${i + 1}/${listLength}导入成功\n` + state.logData
      } else {
        state.logData =
          `${i + 1}/${listLength}导入失败,${res.msg}\n` + state.logData
      }
    }
  } catch (error) {
    state.logData = `导入失败\n` + state.logData
  }
  state.logData += `导入完成\n`
  reqChapter()
}

// 倒叙
const flashBack = () => {
  state.isFlashBack = !state.isFlashBack
  state.chapterList.reverse()
}
</script>
<style lang="scss" scoped>
.edit {
  height: 600px;
  overflow-y: auto;

  .editContent {
    .detailImg {
      min-width: 295px;
      height: 395px;
      border: 10px solid #fff;
      box-shadow: 0 1px 10px #0000001a;

      :deep(img) {
        width: 295px;
      }
    }

    .dataRight {
      margin-left: 20px;

      .author {
        margin-top: 15px;
        font-size: 12px;
        color: #863b13;
      }

      .status {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;

        .text {
          display: flex;
          align-items: center;
          margin-right: 35px;
          color: #999;

          span {
            min-width: 60px;
          }

          .inputText {
            margin-left: 10px;

            :deep(.el-input__inner) {
              width: 100px;
            }
          }
        }
      }

      .introduce {
        display: flex;
        margin-top: 20px;

        span {
          width: 45px;
          height: 15px;
          font-size: 12px;
          color: #999;
        }
      }

      .handler {
        display: flex;
        height: 40px;
        margin: 40px 0 0 20px;
      }
    }
  }

  .chapterContainer {
    display: flex;

    .chapterForm {
      margin-left: 40px;
      color: #606266;

      .saveAndImport {
        display: flex;
      }
    }

    .log {
      width: 600px;
      margin-right: 20px;
      margin-left: 10px;
    }
  }

  .chapterList {
    margin: 50px 20px 0 10px;

    .chapterTitle {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .seriesTitle {
        font-size: 24px;
        color: #606266;
      }

      .seriesDate {
        margin-left: 10px;
        font-size: 13px;
        color: #666;
      }

      .flashBack {
        color: #606266;
        cursor: pointer;
      }
    }

    .chapterContent {
      display: flex;
      flex-wrap: wrap;

      span {
        width: 184px;
        height: 22px;
        padding: 0 15px;
        margin: 0 20px 10px 0;
        overflow: hidden;
        font-size: 12px;
        line-height: 22px;
        white-space: nowrap;
        background-color: #fbfbfb;
      }
    }
  }
}
</style>
