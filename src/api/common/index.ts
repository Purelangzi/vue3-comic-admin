import Request from '@/utils/request'
import {
  QueryNovelDetailData,
  QueryVideoDetailData,
  QueryDetailData,
  CatroonLinkData,
  NovelLinkData,
  VideoLinkData,
} from './data'

enum API {
  UploadFile = '/api/ali/uploadFile',
  QueryNovel = '/api/queryNovelDetail',
  QueryVideo = '/api/queryVideolDetail',
  QueryDetail = '/api/queryDetailById',
  GetCartoonLink = '/api/getCartoonLink',
  GetNovelLink = '/api/getNovelLink',
  GetVideoLink = '/api/getVideoLink',
}

// 阿里云上传图片
export const uploadFile = (data: FormData) =>
  Request.upload(API.UploadFile, data)
// 采集小说详情
export const queryNovelDetail = (data: QueryNovelDetailData) =>
  Request.post(API.QueryNovel, data)
// 采集视频详情
export const queryVideoDetail = (data: QueryVideoDetailData) =>
  Request.post(API.QueryVideo, data)

// 采集漫画详情
export const queryDetailById = (data: QueryDetailData) =>
  Request.post(API.QueryDetail, data)

// 采集漫画链接
export const getCartoonLink = (data: CatroonLinkData) =>
  Request.post(API.GetCartoonLink, data)
// 采集小说链接
export const getNovelLink = (data: NovelLinkData) =>
  Request.post(API.GetNovelLink, data)
// 采集视频链接
export const getVideoLink = (data: VideoLinkData) =>
  Request.post(API.GetVideoLink, data)
