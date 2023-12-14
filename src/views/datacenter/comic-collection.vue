<template>
  <el-tabs v-model="state.activeName" class="cartoonCollect">
    <el-tab-pane label="采集漫画信息" name="first">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>
              商品链接
              <span style="color: #409eff">
                (一行一个,获取漫画详情或章节信息和内容)
              </span>
            </p>
          </div>
          <div class="link container">
            <el-input
              type="textarea"
              v-model="state.ctLinkTextarea"
              :rows="6"
              resize="none"
            ></el-input>
          </div>
          <div class="link footer">
            <p>
              范例：
              <span style="color: red">
                漫客栈：https://www.mkzhan.com/216151/
              </span>
            </p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button
              v-show="state.isStartCollect"
              type="primary"
              @click="startCollectCt"
            >
              开始采集
            </el-button>
            <el-button
              v-show="!state.isStartCollect"
              type="primary"
              plain
              @click="cancelCollect(0)"
            >
              取消采集
            </el-button>
            <el-button
              v-if="radioCatroon"
              type="primary"
              @click="exportInfo(1)"
            >
              导出漫画信息
            </el-button>
            <el-button v-else type="primary" @click="exportInfo(2)">
              导出章节信息
            </el-button>
            <el-button type="danger" @click="clearList(1)">清理列表</el-button>
          </div>
          <div class="link">
            <el-button
              v-if="radioCatroon"
              type="danger"
              @click="addMoreNovelOrCartoon(1)"
            >
              一键添加漫画
            </el-button>
          </div>
          <div class="link radio">
            <el-radio-group
              v-model="radioCatroonValue"
              style="margin-top: 15px"
            >
              <el-radio label="1">漫画详情</el-radio>
              <el-radio label="2">漫画章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input
              type="textarea"
              v-model="state.logDataCt"
              :rows="6"
              disabled
              resize="none"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table
          v-if="radioCatroon"
          size="small"
          :data="state.cartoon.cartoonCtDetail"
          v-loading="state.loadingDetail"
          @selection-change="selectChange"
          border
          height="calc(100vh - 450px )"
          style="width: calc(100vw - 100px)"
          ref="tableCtRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          ></el-table-column>
          <template v-for="col in state.ctDetailColumns" :key="col.label">
            <el-table-column
              v-if="col.isSlot"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image
                    :src="row.cover_lateral"
                    fit="fill"
                    style="width: 56px; height: 56px"
                  ></el-image>
                </div>
                <div v-if="col.prop == 'is_vip'">
                  <el-tag
                    :type="row.is_vip == 1 ? 'danger' : 'success'"
                    effect="dark"
                  >
                    {{ row.is_vip == 1 ? '会员' : '免费' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="col.prop"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
        </el-table>
        <el-table
          v-else
          size="small"
          :data="state.cartoon.cartoonCtChapter"
          v-loading="state.loadingChapter"
          @selection-change="selectChange"
          border
          height="calc(100vh - 520px )"
          style="width: calc(100vw - 100px)"
          ref="tableCtRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center">
            <template #default="{ $index }">
              <span>
                {{
                  (state.pgCartoonParams.pageCt - 1) *
                    state.pgCartoonParams.pageSizeCt +
                  ($index + 1)
                }}
              </span>
            </template>
          </el-table-column>
          <template v-for="col in state.ctChapterColumns" :key="col.label">
            <el-table-column
              v-if="col.isSlot"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div v-if="col.prop == 'cover'">
                  <el-image
                    :src="row.cover"
                    fit="fill"
                    style="width: 56px; height: 56px"
                  ></el-image>
                </div>
                <div v-if="col.prop == 'is_vip'">
                  <el-tag
                    :type="row.is_vip == 1 ? 'danger' : 'success'"
                    effect="dark"
                  >
                    {{ row.is_vip == 1 ? '收费' : '免费' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="col.prop"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
        </el-table>
      </div>
      <el-pagination
        v-if="!radioCatroon"
        style="padding: 20px; text-align: right"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="state.pgCartoonParams.pageCt"
        :page-sizes="[10, 20, 40, 80, 100]"
        v-model:page-size="state.pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="state.pgCartoonParams.totalNumCt"
        background
      ></el-pagination>
    </el-tab-pane>

    <el-tab-pane label="采集漫画/小说链接" name="second">
      <div class="collectionLink" style="justify-content: start">
        <div class="linkMain">
          <div class="link btn">
            <el-button
              v-show="state.isStartCollect"
              type="primary"
              @click="startCollectLink"
            >
              开始采集
            </el-button>
            <el-button
              v-show="!state.isStartCollect"
              type="primary"
              plain
              @click="cancelCollect(1)"
            >
              取消采集
            </el-button>
            <el-button type="primary" @click="exportLink()">导出链接</el-button>
            <el-button
              v-if="radioCtAndCpValue == '2'"
              type="warning"
              @click="addMoreNovelOrCartoon(2)"
            >
              一键添加
            </el-button>
            <el-button
              v-if="radioCtAndCpValue == '3'"
              type="warning"
              @click="addMoreNovelOrCartoon(3)"
            >
              一键添加
            </el-button>
            <el-button type="danger" @click="clearList(3)">清理列表</el-button>
          </div>

          <div class="link radio">
            <el-radio-group
              v-model="radioCtAndCpValue"
              style="margin-top: 15px"
            >
              <el-radio label="1">漫画链接</el-radio>
              <el-radio label="2">小说链接</el-radio>
              <el-radio label="3">视频链接</el-radio>
            </el-radio-group>
          </div>
          <div class="link page">
            <span class="label">开始页码：</span>
            <el-input
              v-model.trim="state.startPage"
              style="width: 80px"
              clearable
            ></el-input>
            <span class="label">总页码：</span>
            <el-input
              v-model.trim="state.endPage"
              style="width: 80px"
              clearable
              :max="50"
            ></el-input>
          </div>
          <div class="link category" v-if="radioCtAndCpValue == '2'">
            <span class="label">小说分类</span>
            <el-select v-model="state.categoryId" class="select">
              <el-option
                v-for="item in catrogyData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="linLog">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input
              type="textarea"
              v-model="state.logDataCtAndCp"
              :rows="6"
              disabled
              resize="none"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table
          v-if="radioCtAndCpValue == '1'"
          size="small"
          :data="state.link.cartoonCtLink"
          v-loading="state.loadingCtLnk"
          @selection-change="selectChange"
          border
          height="calc(100vh - 480px )"
          style="width: calc(100vw - 100px)"
          ref="tableLinkRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" width="60" align="center">
            <template #default="{ $index }">
              <span>
                {{
                  (state.pgCtLinkParams.pageLinkCt - 1) *
                    state.pgCtLinkParams.pageSizeLinkCt +
                  ($index + 1)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template #default="{ row }">
              {{ row.url }}
              <el-icon @click="handleCopy(row.url)"><CopyDocument /></el-icon>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-else-if="radioCtAndCpValue == '2'"
          size="small"
          :data="state.link.novelCtLink"
          v-loading="state.loadingCtLnk"
          @selection-change="selectChange"
          border
          height="calc(100vh - 510px )"
          style="width: calc(100vw - 100px)"
          ref="tableLinkRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" width="60">
            <template #default="{ $index }">
              <span>
                {{
                  (state.pgCpLinkParams.pageLinkCp - 1) *
                    state.pgCpLinkParams.pageLinkCp +
                  ($index + 1)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template #default="{ row }">
              {{ row.url }}
              <i class="copy" @click="handleCopy(row.url)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-else
          size="small"
          :data="state.link.videoCtLink"
          v-loading="state.loadingCtLnk"
          @selection-change="selectChange"
          border
          height="calc(100vh - 480px )"
          style="width: calc(100vw - 100px)"
          ref="tableLinkRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center" width="60">
            <template #default="{ $index }">
              <span>
                {{
                  (state.pgVeLinkParams.pageLinkVideo - 1) *
                    state.pgVeLinkParams.pageSizeLinkVideo +
                  ($index + 1)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="漫画小说链接" align="center">
            <template #default="{ row }">
              {{ row.url }}
              <i class="" @click="handleCopy(row.url)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="radioCtAndCpValue == '1'"
        style="padding: 20px; text-align: right"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="state.pgCtLinkParams.pageLinkCt"
        :page-sizes="[10, 20, 40, 80, 100]"
        v-model:page-size="state.pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="state.pgCtLinkParams.totalNumLinkCt"
        background
      ></el-pagination>
      <el-pagination
        v-if="radioCtAndCpValue == '2'"
        style="padding: 20px; text-align: right"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="state.pgCpLinkParams.pageLinkCp"
        :page-sizes="[10, 20, 40, 80, 100]"
        v-model:page-size="state.pgCartoonParams.pageSizeCt"
        layout="sizes, prev, pager, next, jumper, total"
        :total="state.pgCpLinkParams.totalNumLinkCp"
        background
      ></el-pagination>
      <el-pagination
        v-if="radioCtAndCpValue == '3'"
        style="padding: 20px; text-align: right"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="state.pgVeLinkParams.pageLinkVideo"
        :page-sizes="[10, 20, 40, 80, 100]"
        v-model:page-size="state.pgVeLinkParams.pageSizeLinkVideo"
        layout="sizes, prev, pager, next, jumper, total"
        :total="state.pgVeLinkParams.totalNumLinkVideo"
        background
      ></el-pagination>
    </el-tab-pane>
    <el-tab-pane label="采集小说信息" name="third">
      <div class="collectionLink">
        <div class="linkLeft">
          <div class="link title">
            <p>
              商品链接
              <span style="color: #409eff">
                (一行一个,获取小说详情或小说信息)
              </span>
            </p>
          </div>
          <div class="link container">
            <el-input
              type="textarea"
              v-model="state.cpLinkTextarea"
              :rows="6"
              resize="none"
            ></el-input>
          </div>
          <div class="link footer">
            <p>
              范例：
              <span style="color: red">
                七猫小说网:https://www.9biquge.info/42/42857/
              </span>
            </p>
          </div>
        </div>
        <div class="linkMain">
          <div class="link btn">
            <el-button
              v-show="state.isStartCollect"
              type="primary"
              @click="startCollectChapter"
            >
              开始采集
            </el-button>
            <el-button
            v-show="!state.isStartCollect"
              type="primary"
              plain
              @click="cancelCollect(0)"
            >
              取消采集
            </el-button>
            <el-button
              v-if="radioChpater"
              type="primary"
              @click="exportInfo(3)"
            >
              导出小说信息
            </el-button>
            <el-button v-else type="primary" @click="exportInfo(4)">
              导出章节信息
            </el-button>
            <el-button type="danger" @click="clearList(2)">清理列表</el-button>
          </div>
          <div class="link">
            <el-button
              v-if="radioChpater"
              type="danger"
              @click="addMoreNovelOrCartoon(2)"
            >
              一键添加小说
            </el-button>
          </div>
          <div class="link radio">
            <el-radio-group
              v-model="radioChpaterValue"
              style="margin-top: 15px"
            >
              <el-radio label="1">小说详情</el-radio>
              <el-radio label="2">小说章节</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="linRight">
          <div class="link title">
            <p>执行日志</p>
          </div>
          <div class="link container">
            <el-input
              type="textarea"
              v-model="state.logDataCp"
              :rows="6"
              disabled
              resize="none"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="collectionTable">
        <el-table
          v-if="radioChpater"
          size="small"
          :data="state.novel.novelCtDetail"
          v-loading="state.loadingDetail"
          @selection-change="selectChange"
          border
          height="calc(100vh - 450px )"
          style="width: calc(100vw - 100px)"
          ref="tableCpRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          ></el-table-column>
          <template v-for="col in state.cpDetailColumns" :key="col.label">
            <el-table-column
              v-if="col.isSlot"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div v-if="col.prop == 'cover_lateral'">
                  <el-image
                    :src="row.cover_lateral"
                    fit="fill"
                    style="width: 56px; height: 56px"
                  ></el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="col.prop"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
        </el-table>
        <el-table
          v-else
          size="small"
          :data="state.novel.novelCtChapter"
          v-loading="state.loadingChapter"
          @selection-change="selectChange"
          border
          height="calc(100vh - 550px )"
          style="width: calc(100vw - 100px)"
          ref="tableCpRef"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="序号" align="center">
            <template #default="{ $index }">
              <span>
                {{
                  (state.pgNovelParams.pageCp - 1) *
                    state.pgNovelParams.pageSizeCp +
                  ($index + 1)
                }}
              </span>
            </template>
          </el-table-column>
          <template v-for="col in state.cpChapterColumns" :key="col.label">
            <el-table-column
              :prop="col.prop"
              :label="col.label"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
        </el-table>
      </div>
      <el-pagination
        v-if="!radioChpater"
        style="padding: 20px; text-align: right"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-model:current-page="state.pgNovelParams.pageCp"
        :page-sizes="[10, 20, 40, 80, 100]"
        v-model:page-size="state.pgNovelParams.pageSizeCp"
        layout="sizes, prev, pager, next, jumper, total"
        :total="state.pgNovelParams.totalNumCp"
        background
      ></el-pagination>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ElMessage, TableInstance } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { handleKey } from '@/utils'

import $api from '@/api'
import { catrogyData } from './data'
import { exportXls, exportExcelDataCommon } from '@/utils/excel'
import axios from 'axios'
const { copy, isSupported } = useClipboard()

const tableLinkRef = ref<TableInstance>()
const tableCpRef = ref<TableInstance>()
const tableCtRef = ref<TableInstance>()
const radioCatroonValue = ref('1') // 1漫画详情 2漫画章节
const radioChpaterValue = ref('1') // 1小说详情 2小说章节
const radioCtAndCpValue = ref('1') // 1漫画 2小说 3视频

const state = reactive({
  loadingDetail: false,
  loadingChapter: false,
  loadingCtLnk: false,
  activeName: 'first',
  ctLinkTextarea: '', // 采集链接-漫画
  cpLinkTextarea: '', // 采集链接-小说
  isStartCollect: true, // 是否开始采集
  logDataCt: '', // 日志信息-漫画
  logDataCp: '', // 日志信息-小说
  logDataCtAndCp: '', // 日志信息-漫画/小说
  cartoon: {
    cartoonCtDetail: [] as any[], // 采集的漫画详情列表
    cartoonCtChapter: [] as any[], // 展示采集的漫画章节列表
    cartoonCtChapterAll: [] as any[], // 采集的全部漫画章节列表
  },
  novel: {
    novelCtDetail: [] as any[], // 采集的小说详情列表
    novelCtChapter: [] as any[], // 展示采集的小说章节列表
    novelCtChapterAll: [] as any[], // 采集的全部小说章节列表
  },
  link: {
    cartoonCtLink: [] as any[], // 展示采集的漫画链接列表
    cartoonCtLinkAll: [] as any[], // 采集的全部漫画链接列表
    novelCtLink: [] as any[], // 展示采集的小说链接列表
    novelCtLinkAll: [] as any[], // 采集的全部小说链接列表
    videoCtLink: [] as any[], // 展示采集的视频链接列表
    videoCtLinkAll: [] as any[], // 采集的全部视频链接列表
  },

  // 漫画表头
  ctDetailColumns: [
    { isSlot: false, prop: 'title', label: '漫画名称' },
    { isSlot: false, prop: 'content', label: '漫画简介' },
    { isSlot: true, prop: 'cover_lateral', label: '封面' },
    { isSlot: false, prop: 'author_id', label: '作者id' },
    { isSlot: false, prop: 'chapter_title', label: '最新章节' },
    { isSlot: false, prop: 'price', label: '价格' },
    { isSlot: true, prop: 'is_vip', label: '是否vip' },
  ],
  ctChapterColumns: [
    { isSlot: false, prop: 'title', label: '章节名称' },
    { isSlot: true, prop: 'cover', label: '封面' },
    { isSlot: false, prop: 'title_alias', label: '章节别名' },
    { isSlot: false, prop: 'price', label: '价格' },
    { isSlot: true, prop: 'is_vip', label: '是否vip' },
  ],
  // 小说表头
  cpDetailColumns: [
    { isSlot: false, prop: 'name', label: '小说名称' },
    { isSlot: true, prop: 'cover_lateral', label: '封面' },
    { isSlot: false, prop: 'intro', label: '简介' },
    { isSlot: false, prop: 'author', label: '作者' },
  ],
  cpChapterColumns: [
    { isSlot: false, prop: 'title', label: '章节名称' },
    { isSlot: false, prop: 'title_alias', label: '章节别名' },
  ],
  startPage: '1',
  endPage: '5',
  categoryId: 'xuanhuan',
  selectChapterOption: [] as any[], // 已选择的章节列表多选框数据
  // 漫画章节分页器
  pgCartoonParams: {
    pageCt: 1, // 当前页
    pageSizeCt: 10, // 每页显示的条数
    totalNumCt: 0, // 总条数
  },

  // 小说章节分页器
  pgNovelParams: {
    pageCp: 1,
    pageSizeCp: 10,
    totalNumCp: 0,
  },
  // 漫画链接分页器
  pgCtLinkParams: {
    pageLinkCt: 1,
    pageSizeLinkCt: 10,
    totalNumLinkCt: 0,
  },
  //小说链接分页器
  pgCpLinkParams: {
    pageLinkCp: 1,
    pageSizeLinkCp: 10,
    totalNumLinkCp: 0,
  },
  //视频链接分页器
  pgVeLinkParams: {
    pageLinkVideo: 1,
    pageSizeLinkVideo: 10,
    totalNumLinkVideo: 0,
  },
})

const radioCatroon = computed(() => radioCatroonValue.value === '1')
const radioChpater = computed(() => radioChpaterValue.value === '1')
const cancelCollect = (type:number) => {
  state.isStartCollect = true
  if (type === 0) {
    radioCatroon.value ? (state.loadingDetail = false) : (state.loadingChapter = false)
  } else {
    state.loadingCtLnk = false
  }
}
// 开始采集漫画信息
const startCollectCt = async () => {
  state.logDataCt = ''
  if (!state.ctLinkTextarea) {
    return ElMessage.warning('漫画链接不能为空！')
  }
  radioCatroon.value
    ? (state.loadingDetail = true)
    : (state.loadingChapter = true)
  state.logDataCt = '采集中...\n' + state.logDataCt

  state.isStartCollect = false
  // 数据处理,Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
  const linkArr = Array.from(new Set(handleKey(state.ctLinkTextarea)))
  const linkArrLength = linkArr.length
  for (let i = 0; i < linkArrLength; i++) {
    const item = linkArr[i]
    //准备采集漫画详情的请求参数
    let comicId = ''
    let chapterId = ''
    let platformId = 1
    // 检查链接格式
    let execPlatform = /(mkzhan.com)/g // 平台正则规则
    let platform = item.match(execPlatform) // ["mkzhan.com"]
    if (!platform) {
      state.logDataCt =
        `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` +
        state.logDataCt
    }
    if (state.isStartCollect) {
      state.logDataCt = `正在取消采集中，请稍等....\n` + state.logDataCt;
      break;
    }

    if (platform && platform[0]) {
      if (platform[0] == 'mkzhan.com') {
        // item https://www.mkzhan.com/212350/
        // ["com/212350/", "212350"]
        comicId = (item as any).match(/com\/(.+)\//)[1]
        platformId = 1
      } else {
        state.logDataCt =
          `${
            i + 1
          }/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` +
          state.logDataCt
        continue
      }
    }
    if (comicId.length < 2) {
      state.logDataCt =
        `${
          i + 1
        }/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` +
        state.logDataCt
      continue
    }
    const params: any = {
      comicId, //漫画Id
      chapterId,
      method: 'GET',
      platform: platformId,
      // detail: 1 // 1漫画详情 2漫画章节
    }
    // 采集的是漫画详情
    if (radioCatroon.value) {
      params.detail = 1
      const res = await $api.common.queryDetailById(params)
      if (res.code != 200) {
        state.logDataCt =
          `${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${
            res.msg || ''
          }\n` + state.logDataCt
      } else {
        // 添加所属漫画链接，方便一键添加漫画中添加请求采集的参数:平台id和漫画id
        res.data.url = item
        state.cartoon.cartoonCtDetail.push(res.data)
        state.logDataCt =
          `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + state.logDataCt
      }
    } else {
      // 采集的是漫画章节
      params.detail = 2
      const res = await $api.common.queryDetailById(params)
      if (res.code != 200) {
        state.logDataCt =
          `${i + 1}/${linkArrLength},漫画${comicId}采集失败,【${res.code}】${
            res.msg || ''
          }\n` + state.logDataCt
      } else {
        for (let i = 0; i < res.data.length; i++) {
          const index = res.data[i]
          index.comicId = params.comicId // 上家漫画id，方便一键导入漫画章节时匹配对应的漫画
          state.cartoon.cartoonCtChapterAll.push(index)
        }
        state.logDataCt =
          `${i + 1}/${linkArrLength}漫画${comicId}采集成功\n` + state.logDataCt
      }
    }
  }
  radioCatroon.value
    ? (state.loadingDetail = false)
    : (state.loadingChapter = false)
  state.pgCartoonParams.totalNumCt = state.cartoon.cartoonCtChapterAll.length
  // 切割成要展示的章节数据
  let { pageCt, pageSizeCt } = state.pgCartoonParams
  state.cartoon.cartoonCtChapter = sliceArray(
    state.cartoon.cartoonCtChapterAll,
    pageCt,
    pageSizeCt,
  )
  state.logDataCt = `采集完成\n` + state.logDataCt
  state.isStartCollect = true
}

// 开始采集小说信息
const startCollectChapter = async () => {
  state.logDataCp = ''
  if (!state.cpLinkTextarea) {
    return ElMessage.warning('小说链接不能为空！')
  }
  radioChpater.value
    ? (state.loadingDetail = true)
    : (state.loadingChapter = true)
  state.logDataCp = '采集中...\n' + state.logDataCp
  state.isStartCollect = false
  // 数据处理，Set数组去重然后浅拷贝成数组,只有一层不会改变原数组
  const linkArr = Array.from(new Set(handleKey(state.cpLinkTextarea)))
  const linkArrLength = linkArr.length
  for (let i = 0; i < linkArrLength; i++) {
    const item = linkArr[i]
    // 准备采集小说详情的请求参数
    let comicId = ''
    let pageId = '1'
    // 检查链接格式
    let execPlatform = /(9biquge.info)/g // 平台正则规则
    let platform = item.match(execPlatform) // ["9biquge.info"]
    if (!platform) {
      state.logDataCp =
        `${i + 1}/${linkArrLength}暂不支持此平台连接，请检查链接是否正确！\n` +
        state.logDataCp
    }
    if (state.isStartCollect) {
      state.logDataCp = `正在取消采集中，请稍等....\n` + state.logDataCp
      break
    }
    if (platform && platform[0]) {
      if (platform[0] == '9biquge.info') {
        // item https://www.9biquge.info/44/44347/
        // ids ["com/44/44347", "44/44347"]
        let ids = (item as any).match(/info\/(.+)\//)[1].split('/')
        pageId = ids[0]
        comicId = ids[1]
      } else {
        state.logDataCp =
          `${
            i + 1
          }/${linkArrLength}未从链接中获取到漫画id，请检查链接是否正确！\n` +
          state.logDataCp
        continue
      }
    }
    if (comicId.length == 0) {
      state.logDataCp =
        `${
          i + 1
        }/${linkArrLength}未从链接中获取到小说id，请检查链接是否正确！\n` +
        state.logDataCp
      continue
    }

    const params = {
      comicId,
      pageId,
      type: 0,
    }

    // 采集的是小说详情
    if (radioChpater.value) {
      const res = await $api.common.queryNovelDetail(params)
      if (res.code != 200) {
        state.logDataCp =
          `${i + 1}/${linkArrLength},小说${comicId}采集失败,}\n` +
          state.logDataCp
      } else {
        // 添加所属小说链接，方便一键添加小说中添加请求采集的参数:平台id和小说id
        res.data.url = item
        state.novel.novelCtDetail.push(res.data)
        state.logDataCp =
          `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` + state.logDataCp
      }
    } else {
      // 采集的是小说章节
      try {
        params.type = 1
        const res = await $api.common.queryNovelDetail(params)
        if (res.code != 200) {
          state.logDataCp =
            `${i + 1}/${linkArrLength},小说${comicId}采集失败,【${
              res.code
            }】IP限制，请稍后重新采集\n` + state.logDataCp
        } else {
          state.novel.novelCtChapterAll = state.novel.novelCtChapterAll.concat(
            res.data,
          )
          state.logDataCp =
            `${i + 1}/${linkArrLength}小说${comicId}采集成功\n` +
            state.logDataCp
        }
      } catch (error) {
        state.logDataCp =
          `${i + 1}/${linkArrLength}采集失败\n` + state.logDataCp
      }
    }
  }
  radioChpater.value
    ? (state.loadingDetail = false)
    : (state.loadingChapter = false)
  state.pgNovelParams.totalNumCp = state.novel.novelCtChapterAll.length
  // 切割成要展示的章节数据
  const { pageCp, pageSizeCp } = state.pgNovelParams
  state.novel.novelCtChapter = sliceArray(
    state.novel.novelCtChapterAll,
    pageCp,
    pageSizeCp,
  )
  state.logDataCp = `采集完成\n` + state.logDataCp
  state.isStartCollect = true
}

// 开始采集漫画/小说/视频链接
const startCollectLink = async () => {
  state.loadingCtLnk = true
  state.logDataCtAndCp = ''
  state.logDataCtAndCp = '采集中...\n' + state.logDataCtAndCp
  state.isStartCollect = false
  if (!state.endPage) {
    state.endPage = '1'
  } else {
    state.endPage = Number(state.endPage) > 50 ? '50' : state.endPage
  }
  if (!state.startPage) {
    state.startPage = '1'
  } else if (Number(state.startPage) > Number(state.endPage)) {
    state.startPage = state.endPage
  }
  let num = parseInt(state.startPage)
  let page = parseInt(state.endPage)

  // 采集的是漫画链接
  if (radioCtAndCpValue.value == '1') {
    for (let i = num; i <= page; i++) {
      if (state.isStartCollect) {
        state.logDataCtAndCp =
          `正在取消采集中，请稍等....\n` + state.logDataCtAndCp
        break
      }
      const params = {
        platform: 1,
        page: i,
      }
      try {
        const res = await $api.common.getCartoonLink(params)
        if (res.code !== 200) {
        state.logDataCtAndCp = `第${i}页采集失败\n` + state.logDataCtAndCp
        } else {
          state.logDataCtAndCp =
            `正在采集第${i}页，共采集到${res.data.length}条数据\n` +
            state.logDataCtAndCp
          res.data?.forEach((el: any) => state.link.cartoonCtLinkAll.push(el))
        }
      } catch (error) {
        state.loadingCtLnk = false
        state.logDataCtAndCp =`接口请求失败\n` +state.logDataCtAndCp
        state.isStartCollect = true
        console.log(error);
      }
      
      
    }
    state.pgCtLinkParams.totalNumLinkCt = state.link.cartoonCtLinkAll.length
    const { pageLinkCt, pageSizeLinkCt } = state.pgCtLinkParams
    state.link.cartoonCtLink = sliceArray(
      state.link.cartoonCtLinkAll,
      pageLinkCt,
      pageSizeLinkCt,
    )
  } else if (radioCtAndCpValue.value == '2') {
    // 采集的是小说链接
    for (let i = num; i <= page; i++) {
      if (state.isStartCollect) {
        state.logDataCtAndCp =
          `正在取消采集中，请稍等....\n` + state.logDataCtAndCp
        break
      }
      const params = {
        category_id: state.categoryId,
        page: i,
      }
      try {
        const res = await $api.common.getNovelLink(params)
        if (res.code !== 200) {
          state.logDataCtAndCp =
            `第${i}页采集失败,IP限制\n` + state.logDataCtAndCp
        } else {
          state.logDataCtAndCp =
            `正在采集第${i}页，共采集到${res.data.length}条数据\n` +
            state.logDataCtAndCp
          res.data?.forEach((el: any) => state.link.novelCtLinkAll.push(el))
        }
      } catch (error) {
        state.loadingCtLnk = false
        state.logDataCtAndCp =`接口请求失败\n` +state.logDataCtAndCp
        state.isStartCollect = true
        console.log(error);
      }
      
    }
    // 如果采集的小说链接数据为空，使用mock
    if (!state.link.novelCtLinkAll.length) {
      const { data } = await axios.get('/mock-api/getNovelLink')
      ElMessage.success('使用mock数据')
      state.link.novelCtLinkAll = state.link.novelCtLinkAll.concat(data.data)
    }
    state.pgCpLinkParams.totalNumLinkCp = state.link.novelCtLinkAll.length
    const { pageLinkCp, pageSizeLinkCp } = state.pgCpLinkParams
    state.link.novelCtLink = sliceArray(
      state.link.novelCtLinkAll,
      pageLinkCp,
      pageSizeLinkCp,
    )
  } else {
    // 采集的是视频链接
    for (let i = num; i <= page; i++) {
      if (state.isStartCollect) {
        state.logDataCtAndCp =
          `正在取消采集中，请稍等....\n` + state.logDataCtAndCp
        break
      }
      const params = {
        page: i,
      }
      try {
        const res = await $api.common.getVideoLink(params)
        if (res.code !== 200) {
          state.logDataCtAndCp = `第${i}页采集失败\n` + state.logDataCtAndCp
        } else {
          state.logDataCtAndCp =
            `正在采集第${i}页，共采集到${res.data.length}条数据\n` +
            state.logDataCtAndCp
          res.data?.forEach((el: any) => state.link.videoCtLinkAll.push(el))
        }
      } catch (error) {
        state.loadingCtLnk = false
        state.logDataCtAndCp =`接口请求失败\n` +state.logDataCtAndCp
        state.isStartCollect = true
        console.log(error);
      }
      
    }
    // 如果采集的视频链接数据为空，使用mock
    if (!state.link.videoCtLinkAll.length) {
      const { data } = await axios.get('/mock-api/getVideoLink')
      ElMessage.success('使用mock数据')
      state.link.videoCtLinkAll = state.link.videoCtLinkAll.concat(data.data)
    }
    state.pgVeLinkParams.totalNumLinkVideo = state.link.videoCtLinkAll.length
    const { pageLinkVideo, pageSizeLinkVideo } = state.pgVeLinkParams
    state.link.videoCtLink = sliceArray(
      state.link.videoCtLinkAll,
      pageLinkVideo,
      pageSizeLinkVideo,
    )
  }
  state.loadingCtLnk = false
  state.logDataCtAndCp = '采集完成\n' + state.logDataCtAndCp
  state.isStartCollect = true
}
// 导出excel漫画1,漫画章节2,小说3,小说章节4
const exportInfo = (type: number) => {
  let result = []
  let filename = ''
  let head = {}
  switch (type) {
    case 1:
      filename = '漫画列表'
      head = {
        title: '漫画名称',
        cover: '封面',
        content: '漫画简介',
        author_id: '作者',
        price: '价格',
        is_vip: '是否vip',
        url: '采集链接',
        comic_id: '上家漫画ID',
        cover_lateral: '漫画详情封面',
      }
      // 选择的章节列表
      result =
        state.selectChapterOption.length > 0
          ? state.selectChapterOption
          : state.cartoon.cartoonCtDetail
      break
    case 2:
      filename = '漫画章节列表'
      head = {
        title: '章节名称',
        cover: '封面',
        title_alias: '章节别名',
        price: '价格',
        is_vip: '是否vip',
        url: '采集链接',
        chapter_id: '上家ID', // chapter_id就是platform_chapter
        comicId: '上家漫画ID',
      }
      result =
        state.selectChapterOption.length > 0
          ? state.selectChapterOption
          : state.cartoon.cartoonCtChapter

      break
    case 3:
      filename = '小说列表'
      head = {
        name: '小说名称',
        cover_lateral: '封面',
        intro: '简介',
        author: '作者',
        url: '采集链接',
        platform_comic: '上家漫画ID',
        pageId: '上家页面id',
      }
      result =
        state.selectChapterOption.length > 0
          ? state.selectChapterOption
          : state.novel.novelCtDetail
      break
    case 4:
      filename = '小说章节列表'
      head = {
        title: '小说名称',
        title_alias: '章节别名',
        platform_chapter: '上家章节ID',
        platform_comic: '上家漫画ID',
      } as any
      result =
        state.selectChapterOption.length > 0
          ? state.selectChapterOption
          : state.novel.novelCtChapter
      break
  }
  if (!result.length) {
    return ElMessage.warning('请采集')
  }
  //定义一个数组，用来保存最后需要发请求的数据,最后结果是个数组对象[{},{}]
  const list = result.map((item) => {
    const obj = {} as any
    for (const k in item) {
      // head的键值和res的对象属性相同，head['漫画名称']存在？
      // @ts-expect-error 忽略类型
      if (head[k]) {
        // 相当于obj.name = item.name，而item.name='xxx',添加属性并赋值
        // @ts-expect-error 忽略类型
        obj[head[k]] = item[k]
      }
    }
    return obj
  })

  exportXls(filename, list)
}
// 导出采集好的链接（漫画，小说，视频）
const exportLink = () => {
  const excelName = ['漫画', '小说', '视频']
  exportExcelDataCommon(
    tableLinkRef?.value?.$el,
    `${excelName[(radioCtAndCpValue.value as any) - 1]}链接`,
  )
}
// 一键添加漫画小说视频 type 1漫画 2小说 3视频
const addMoreNovelOrCartoon = async (type: number) => {
  let result = []

  // 一键添加漫画(不用检查链接格式)
  if (type == 1) {
    state.logDataCt = ''
    if (!state.cartoon.cartoonCtDetail.length) {
      return ElMessage.warning('请采集漫画链接')
    }
    result =
      state.selectChapterOption.length > 0
        ? state.selectChapterOption
        : state.cartoon.cartoonCtDetail
    state.logDataCt = '开始一键添加漫画...\n' + state.logDataCt
    const linkArrLength = result.length
    for (let i = 0; i < result.length; i++) {
      const item = result[i]
      // // 准备采集漫画详情的请求参数
      const params = {
        // item https://www.mkzhan.com/212350/
        // ["com/212350/", "212350"]
        comicId: item['url'].match(/com\/(.+)\//)[1], //漫画Id
        chapterId: '',
        method: 'GET',
        platform: 1,
        detail: 1, // 1漫画详情 2漫画章节
      }
      const res = await $api.common.queryDetailById(params)
      if (res.code != 200) {
        state.logDataCt =
          `${i + 1}/${linkArrLength},漫画${params.comicId}采集失败,【${
            res.code
          }】${res.msg || ''}\n` + state.logDataCt
      } else {
        const {
          title,
          content,
          cover,
          price,
          is_vip,
          status,
          cover_lateral,
          comic_id,
          author_id,
        } = res.data
        // 准备添加漫画的请求参数
        const cartoon = {
          name: title,
          cartoon_introduction: content,
          img_url: cover,
          cover_lateral,
          price,
          charge: is_vip,
          status,
          platform_comic: comic_id,
          category_id: 1,
          author: author_id,
        }
        state.logDataCt =
          `${i + 1}/${linkArrLength}漫画${params.comicId}添加成功\n` +
          state.logDataCt
        state.logDataCt = `开始添加${cartoon.name}\n` + state.logDataCt

        const res1 = await $api.cartoon.addList(cartoon)
        if (res1.code == 200) {
          state.logDataCt = `${cartoon.name}添加成功\n` + state.logDataCt
        } else {
          state.logDataCt =
            `${cartoon.name}添加失败,${res1.msg}\n` + state.logDataCt
        }
      }
    }
    state.logDataCt = `一键添加漫画完成\n` + state.logDataCt
  } else if (type == 2) {
    // 一键添加小说(不用检查链接格式)
    if (state.activeName == 'third') {
      state.logDataCp = ''
      if (radioChpater.value) {
        if (!state.novel.novelCtDetail.length)
          return ElMessage.warning('请采集小说链接')
        result =
          state.selectChapterOption.length > 0
            ? state.selectChapterOption
            : state.novel.novelCtDetail
        state.logDataCp = '开始一键添加小说...\n' + state.logDataCp
      }
    } else if (state.activeName == 'second') {
      state.logDataCtAndCp = ''
      if (radioCtAndCpValue.value == '2') {
        if (!state.link.novelCtLink.length)
          return ElMessage.warning('请采集小说链接')
        result =
          state.selectChapterOption.length > 0
            ? state.selectChapterOption
            : state.link.novelCtLink
        state.logDataCtAndCp = '开始一键添加小说...\n' + state.logDataCtAndCp
      }
    }
    const linkArrLength = result.length
    for (let i = 0; i < linkArrLength; i++) {
      const item = result[i]
      // item https://www.9biquge.info/44/44347/
      // ids ["com/44/44347", "44/44347"]
      let ids = item['url'].match(/info\/(.+)\//)[1].split('/')
      // 准备采集小说详情的请求参数
      const params = {
        comicId: ids[1],
        pageId: ids[0],
      }

      const res = await $api.common.queryNovelDetail(params)
      // 采集漫画/小说链接
      if (state.activeName == 'second') {
        if (res.code != 200) {
          state.logDataCtAndCp =
            `${i + 1}/${linkArrLength},小说${params.comicId}采集失败,IP限制\n` +
            state.logDataCtAndCp
        } else {
          const novel = res.data
          state.logDataCtAndCp =
            `${i + 1}/${linkArrLength}小说${params.comicId}添加成功\n` +
            state.logDataCtAndCp
          state.logDataCtAndCp =
            `开始添加${novel.name}\n` + state.logDataCtAndCp
          novel['category_id'] = 1
          const res1 = await novel.addList(novel)
          if (res1.code == 200) {
            state.logDataCtAndCp =
              `${novel.name}添加成功\n` + state.logDataCtAndCp
          } else {
            state.logDataCtAndCp =
              `${novel.name}添加失败,${res1.msg}\n` + state.logDataCtAndCp
          }
        }
      } else {
        if (res.code != 200) {
          state.logDataCp =
            `${i + 1}/${linkArrLength},小说${
              params.comicId
            }采集失败,,IP限制\n` + state.logDataCp
        } else {
          const novel = res.data
          state.logDataCp =
            `${i + 1}/${linkArrLength}小说${params.comicId}添加成功\n` +
            state.logDataCp
          state.logDataCp = `开始添加${novel.name}\n` + state.logDataCp
          novel['category_id'] = 1
          const res1 = await novel.addList(novel)
          if (res1.code == 200) {
            state.logDataCp = `${novel.name}添加成功\n` + state.logDataCp
          } else {
            state.logDataCp =
              `${novel.name}添加失败,${res1.msg}\n` + state.logDataCp
          }
        }
      }
    }
    state.activeName == 'third'
      ? (state.logDataCp = `一键添加小说完成\n` + state.logDataCp)
      : (state.logDataCtAndCp = `一键添加小说完成\n` + state.logDataCtAndCp)
  } else {
    if (!state.link.videoCtLink.length)
      return ElMessage.success('请采集视频链接')
    state.logDataCtAndCp = ''
    result =
      state.selectChapterOption.length > 0
        ? state.selectChapterOption
        : state.link.videoCtLink
    state.logDataCtAndCp = '开始一键添加视频...\n' + state.logDataCtAndCp
    const linkArrLength = result.length
    for (let i = 0; i < linkArrLength; i++) {
      const item = result[i]
      // // 准备采集视频详情的请求参数
      const params = {
        // item https://www.shnakun.com/voddetail/41777.html/
        // ["voddetail/41777.", "41777"]
        comicId: item.match(/voddetail\/(.+)\./)[1], //视频Id,
        type: 0,
      }
      const res = await $api.common.queryVideoDetail(params)
      if (res.code != 200) {
        state.logDataCtAndCp =
          `${i + 1}/${linkArrLength},漫画${params.comicId}采集失败,【${
            res.code
          }】${res.msg || ''}\n` + state.logDataCtAndCp
      } else {
        const { name, intro, actor, director, platform_comic, cover_lateral } =
          res.data
        // 准备添加视频的请求参数
        const video = {
          name,
          intro,
          actor,
          director,
          platform_comic,
          cover_lateral,
          category_id: '1',
        }
        state.logDataCtAndCp =
          `${i + 1}/${linkArrLength}视频${params.comicId}添加成功\n` +
          state.logDataCtAndCp
        state.logDataCtAndCp = `开始添加 ${video.name}\n` + state.logDataCtAndCp
        const res1 = await $api.video.addList(video)
        if (res1.code == 200) {
          state.logDataCtAndCp =
            `视频 ${video.name}添加成功\n` + state.logDataCtAndCp
        } else {
          state.logDataCtAndCp =
            `视频 ${video.name}添加失败,${res1.msg}\n` + state.logDataCtAndCp
        }
      }
    }
    state.logDataCt = `一键添加视频完成\n` + state.logDataCt
  }
}
// 清理列表 1漫画 2小说 3漫画/小说
const clearList = (type: number) => {
  if (type == 1) {
    if (radioCatroon.value) {
      state.cartoon.cartoonCtDetail = []
    } else {
      state.cartoon.cartoonCtChapterAll = []
      state.cartoon.cartoonCtChapter = []
      state.pgCartoonParams = reactive({
        pageCt: 1,
        pageSizeCt: 10,
        totalNumCt: 0,
      })
    }
  } else if (type == 2) {
    if (radioChpater.value) {
      state.novel.novelCtDetail = []
    } else {
      state.novel.novelCtChapterAll = []
      state.novel.novelCtChapter = []
      state.pgNovelParams = reactive({
        pageCp: 1,
        pageSizeCp: 10,
        totalNumCp: 0,
      })
    }
  } else {
    switch (radioCtAndCpValue.value) {
      case '1':
        state.link.cartoonCtLink = []
        state.link.cartoonCtLinkAll = []
        state.pgCtLinkParams = reactive({
          pageLinkCt: 1,
          pageSizeLinkCt: 10,
          totalNumLinkCt: 0,
        })
        break
      case '2':
        state.link.novelCtLinkAll = []
        state.link.novelCtLink = []
        state.pgCpLinkParams = reactive({
          pageLinkCp: 1,
          pageSizeLinkCp: 10,
          totalNumLinkCp: 0,
        })
        break
      case '3':
        state.link.videoCtLinkAll = []
        state.link.videoCtLink = []
        state.pgVeLinkParams = reactive({
          pageLinkVideo: 1,
          pageSizeLinkVideo: 10,
          totalNumLinkVideo: 0,
        })
        break
    }
  }
}
// 多选框改变时，选择的章节列表
const selectChange = (selection: any[]) => {
  state.selectChapterOption = selection
}

// 每页显示的条数改变时
const sizeChange = (pageSize: number) => {
  // 漫画章节
  if (!radioCatroon.value) {
    state.pgCartoonParams.pageCt = 1
    state.pgCartoonParams.pageSizeCt = pageSize
    if (state.cartoon.cartoonCtChapterAll.length) {
      const { pageCt, pageSizeCt } = state.pgCartoonParams
      state.cartoon.cartoonCtChapter = sliceArray(
        state.cartoon.cartoonCtChapterAll,
        pageCt,
        pageSizeCt,
      )
    }
  } else if (!radioChpater.value) {
    // 小说章节
    state.pgNovelParams.pageCp = 1
    state.pgNovelParams.pageSizeCp = pageSize
    if (state.novel.novelCtChapterAll.length) {
      const { pageCp, pageSizeCp } = state.pgNovelParams
      state.novel.novelCtChapter = sliceArray(
        state.novel.novelCtChapterAll,
        pageCp,
        pageSizeCp,
      )
    }
  } else {
    // 漫画/小说链接 1漫画 2小说 3视频
    switch (radioCtAndCpValue.value) {
      case '1':
        state.pgCtLinkParams.pageLinkCt = 1
        state.pgCtLinkParams.pageSizeLinkCt = pageSize

        if (state.link.cartoonCtLinkAll.length) {
          const { pageLinkCt, pageSizeLinkCt } = state.pgCtLinkParams
          state.link.cartoonCtLink = sliceArray(
            state.link.cartoonCtLinkAll,
            pageLinkCt,
            pageSizeLinkCt,
          )
        }
        break
      case '2':
        state.pgCpLinkParams.pageLinkCp = 1
        state.pgCpLinkParams.pageSizeLinkCp = pageSize
        if (state.link.novelCtLinkAll.length) {
          const { pageLinkCp, pageSizeLinkCp } = state.pgCpLinkParams
          state.link.novelCtLink = sliceArray(
            state.link.novelCtLinkAll,
            pageLinkCp,
            pageSizeLinkCp,
          )
        }
        break
      case '3':
        state.pgVeLinkParams.pageLinkVideo = 1
        state.pgVeLinkParams.pageSizeLinkVideo = pageSize
        if (state.link.videoCtLinkAll.length) {
          const { pageLinkVideo, pageSizeLinkVideo } = state.pgVeLinkParams
          state.link.videoCtLink = sliceArray(
            state.link.videoCtLinkAll,
            pageLinkVideo,
            pageSizeLinkVideo,
          )
        }
        break
    }
  }
}
// 当前页改变时
const currentChange = (page: number) => {
  // 漫画章节
  if (!radioCatroon.value) {
    state.pgCartoonParams.pageCt = page
    if (state.cartoon.cartoonCtChapterAll.length) {
      const { pageCt, pageSizeCt } = state.pgCartoonParams
      state.cartoon.cartoonCtChapter = sliceArray(
        state.cartoon.cartoonCtChapterAll,
        pageCt,
        pageSizeCt,
      )
    }
  } else if (!radioChpater.value) {
    // 小说章节
    state.pgNovelParams.pageCp = page
    if (state.novel.novelCtChapterAll.length) {
      const { pageCp, pageSizeCp } = state.pgNovelParams
      state.novel.novelCtChapter = sliceArray(
        state.novel.novelCtChapterAll,
        pageCp,
        pageSizeCp,
      )
    }
  } else {
    // 漫画/小说链接 1漫画 2小说 3视频
    switch (radioCtAndCpValue.value) {
      case '1':
        state.pgCtLinkParams.pageLinkCt = page
        if (state.link.cartoonCtLinkAll.length) {
          const { pageLinkCt, pageSizeLinkCt } = state.pgCtLinkParams
          state.link.cartoonCtLink = sliceArray(
            state.link.cartoonCtLinkAll,
            pageLinkCt,
            pageSizeLinkCt,
          )
        }
        break
      case '2':
        state.pgCpLinkParams.pageLinkCp = page
        if (state.link.novelCtLinkAll.length) {
          const { pageLinkCp, pageSizeLinkCp } = state.pgCpLinkParams
          state.link.novelCtLink = sliceArray(
            state.link.novelCtLinkAll,
            pageLinkCp,
            pageSizeLinkCp,
          )
        }
        break
      case '3':
        state.pgVeLinkParams.pageLinkVideo = page
        if (state.link.videoCtLinkAll.length) {
          const { pageLinkVideo, pageSizeLinkVideo } = state.pgVeLinkParams
          state.link.videoCtLink = sliceArray(
            state.link.videoCtLinkAll,
            pageLinkVideo,
            pageSizeLinkVideo,
          )
        }
        break
    }
  }
}

const sliceArray = (data: any, page: number, pageSize: number) => {
  return data.slice((page - 1) * pageSize, page * pageSize)
}

const handleCopy = (url: string) => {
  // http协议下，navigator.clipboard为undefined
  if(navigator.clipboard){
    if (!isSupported) {
      ElMessage.error('您的浏览器不支持Clipboard API')
      return
    }
    copy(url)
    ElMessage.success('已复制')
  } else {
    const input = document.createElement('input');
    input.setAttribute('value', url);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    ElMessage.success('已复制')
  }
}
watch(
  () => state.activeName,
  (val) => {
    state.selectChapterOption = []
    if (val === 'first') {
      tableCpRef.value?.clearSelection()
      tableLinkRef.value?.clearSelection()
    } else if (val === 'second') {
      tableCtRef.value?.clearSelection()
      tableLinkRef.value?.clearSelection()
    } else {
      tableCpRef.value?.clearSelection()
      tableCtRef.value?.clearSelection()
    }
  },
)
watch(
  () => radioCatroon.value,
  () => {
    state.selectChapterOption = []
  },
)
watch(
  () => radioChpater.value,
  () => {
    state.selectChapterOption = []
  },
)
watch(
  () => radioCtAndCpValue.value,
  () => {
    state.selectChapterOption = []
  },
)
</script>
<style lang="scss" scoped>
.cartoonCollect {
  font-size: 14px;

  .collectionLink {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    margin-top: 10px;
    background-color: #fff;
    border: 1px solid #ebeef5;

    .linkLeft {
      flex: 1 1 auto;
      width: 700px;
    }

    .linkMain {
      width: 360px;
      padding: 60px 10px 0 25px;
    }

    .linRight {
      flex: 1 1 auto;
      width: 400px;
    }

    .linLog {
      width: 400px;
      margin-left: 50px;
    }

    .link {
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;

      :deep(.el-input__inner) {
        height: 30px;
      }

      &.page {
        .label {
          margin-left: 10px;
        }
      }

      &.category {
        .label {
          margin-left: 10px;
        }

        .select {
          margin-left: 10px;
          line-height: 38px;
        }

        :deep(.el-input__inner) {
          width: 160px;
        }
      }
    }
  }

  .collectionTable {
    margin-top: 20px;

    :deep(.el-icon) {
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .copy {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
