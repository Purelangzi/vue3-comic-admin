<template>
  <div class="edit">
    <el-tabs v-model="state.activeName">
      <el-tab-pane v-loading="loading" label="小说详情" name="first">
        <div class="editContent">
          <el-row>
            <el-col :span="8" :xl="6" :lg="10" :md="0" :sm="0" :xs="0">
              <el-image
                :src="state.editForm.cover_lateral"
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
                      v-model="state.editForm.is_vip"
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
                  <div class="text" v-if="state.editForm.is_vip === 0">
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
                    v-model="state.editForm.intro"
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
                    保存小说
                  </el-button>
                  <my-upload
                    ref="uploadRef"
                    :upload="state.eidtUpload"
                    v-model:avatar="state.editForm.cover_lateral"
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
            <div class="saveAndImport">
              <el-button
                type="primary"
                @click="onSaveChapter"
                style="margin-right: 15px"
              >
                保存章节
              </el-button>
              <el-button
                type="success"
                @click="getMoreNewChapter"
                :disabled="newChapterBtn"
                icon="Bottom"
              >
                一键获取最新章节
              </el-button>
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
import { ElMessage, FormInstance } from 'element-plus'
import type { FormRules } from 'element-plus'
import { loading, newChapterBtn, chargeArr } from './edit-data'
import { getDetail, getChapterList, updateList, addChapter } from '@/api/novel'
import { queryNovelDetail } from '@/api/common'
import MyUpload from '@/components/Upload/index.vue'
import { useDateFormat } from '@vueuse/core'

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
  // 小说id
  id: undefined,
  // 小说详情表单
  editForm: {
    id: 0,
    cover_lateral: '',
    name: '',
    author: '',
    read: 0,
    fabulous: 0,
    is_vip: 0,
    price: 0,
    intro: '',
    category_id: 0,
    pageId: 0,
    platform_comic: 0,
  },
  update_time: '',
  // 小说章节列表
  chapterList: [] as any[],
  // 倒叙还是顺序
  isFlashBack: true,
  // chapterImg:'',
  chapterForm: {
    comic_id: props.id, // 小说id,父级id
    title: '', // 章节名称
    title_alias: 1, // 章节别名
    is_vip: 0, // 是否付费0/1
  },
  logData: '',

  editFileRaw: undefined, // 临时上传的详情封面数据
  eidtUpload: false, // 控制是否上传到服务器
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

// // 保存小说
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
// 一键获取最新章节并更新最新章节
const getMoreNewChapter = async () => {
  const params = {
    pageId: state.editForm.pageId,
    comicId: state.editForm.platform_comic,
    type: 1,
  }
  newChapterBtn.value = true
  const res = await queryNovelDetail(params)

  if (res.code == 200) {
    const chapterLength = res.data.length
    if (!chapterLength) {
      newChapterBtn.value = false
      return ElMessage.warning('数据为空，无最新章节')
    }
    state.logData = `开始上传章节...`

    for (let index = 0; index < res.data.length; index++) {
      const item = res.data[index]
      item.comic_id = state.editForm.id
      delete item.platform_comic
      const res1 = await addChapter(item)
      if (res1.code == 200) {
        state.logData =
          `${index + 1}/${chapterLength}导入成功\n` + state.logData
      } else {
        state.logData =
          `${index + 1}/${chapterLength}导入失败,${res1.msg}\n` + state.logData
      }
    }
    state.logData = `导入完成\n` + state.logData
    reqDetail()
    reqChapter()
  } else {
    ElMessage.error('IP限制,需要梯子')
  }
  newChapterBtn.value = false
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
