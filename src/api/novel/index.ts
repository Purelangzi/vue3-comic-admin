import Request from '@/utils/request'
import { AddData, UpdateData, DeleteData, GetDetail } from '../type'
import { GetData, AddNovel, AddChapter, GetChapter, UpdateNovel } from './data'

enum API {
  GetCategory = '/api/novel/getCtcategory',
  AddCategory = '/api/novel/addCategory',
  UpdateCategory = '/api/novel/editCtcategory',
  DeleteCategory = '/api/novel/deleteCtcategory',

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
  Request.get(API.GetCategory, data) // 获取小说分类

export const addCategory = (data: AddData) =>
  Request.post(API.AddCategory, data) // 添加小说分类

export const updateCategory = (data: UpdateData) =>
  Request.post(API.UpdateCategory, data) // 修改小说分类

export const deleteCategory = (data: DeleteData) =>
  Request.post(API.DeleteCategory, data) // 删除小说分类

export const getList = (data: GetData) => Request.get(API.GetList, data) // 获取小说列表

export const addList = (data: AddNovel) => Request.post(API.AddList, data) // 添加小说

export const deleteList = (data: DeleteData) =>
  Request.post(API.DeleteLsit, data) // 删除小说

export const updateList = (data: UpdateNovel) =>
  Request.post(API.UpdateList, data) // 修改小说详情

export const getDetail = (data: GetDetail) => Request.get(API.GetDetail, data) // 获取小说详情

export const addChapter = (data: AddChapter) =>
  Request.post(API.AddChapter, data) // 添加小说章节

export const getChapterList = (data: GetChapter) =>
  Request.get(API.GetChapter, data) // 获取小说章节列表

// 修改小说章节信息
export const editChapter = (data: any) => Request.post(API.EditChapter, data)
// 删除小说章节
export const deleteChapter = (data: any) =>
  Request.post(API.DeleteChapter, data)
