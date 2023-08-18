import Request from '@/utils/request'
import { AddData, UpdateData, DeleteData, GetDetail } from '../type'
import { GetData, AddVideo, AddChapter, GetChapter, UpdateVideo } from './data'
enum API {
  GetCategory = '/api/video/getCtcategory',
  AddCategory = '/api/video/addCategory',
  UpdateCategory = '/api/video/editCtcategory',
  DeleteCategory = '/api/video/deleteCtcategory',

  GetList = '/api/novel/getCartoonList',
  AddList = '/api/novel/addCartoon',
  DeleteLsit = '/api/novel/deleteCartoon',
  UpdateList = '/api/novel/editCartoon',
  GetDetail = '/api/novel/getCartoonDetail',

  AddChapter = '/api/novel/addChapter',
  GetChapter = '/api/novel/getChapterList',
  EditChapter = '/api/novel/editChapter',
  DeleteChapter = '/api/novel/deleteChapter',
}

export const getCategory = (data?: GetData) =>
  Request.get(API.GetCategory, data)
export const addCategory = (data: AddData) =>
  Request.post(API.AddCategory, data)
export const updateCategory = (data: UpdateData) =>
  Request.post(API.UpdateCategory, data)
export const deleteCategory = (data: DeleteData) =>
  Request.post(API.DeleteCategory, data)

export const getList = (data: GetData) =>
  Request.get('/api/video/getCartoonList', data)
export const deleteList = (data: DeleteData) =>
  Request.post('/api/video/deleteCartoon', data)
export const updateList = (data: UpdateVideo) =>
  Request.post('/api/video/editCartoon', data)
export const addList = (data: AddVideo) =>
  Request.post('/api/video/addCartoon', data)

export const addChapter = (data: AddChapter) =>
  Request.post('/api/video/addChapter', data) // 添加视频章节

export const getDetail = (data: GetDetail) =>
  Request.get('/api/video/getCartoonDetail', data) // 获取视频详情

export const getChapterList = (data: GetChapter) =>
  Request.get('/api/video/getChapterList', data) // 获取视频章节列表

export const editChapter = (data: any) =>
  Request.post('/api/video/editChapter', data) // 修改视频章节信息

export const deleteChapter = (data: any) =>
  Request.post('/api/video/deleteChapter', data) // 删除视频章节
