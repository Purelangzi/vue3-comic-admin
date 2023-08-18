import Request from '@/utils/request'
import { AddData, UpdateData, DeleteData, GetDetail } from '../type'
import {
  GetData,
  AddCartoon,
  AddChapter,
  GetChapter,
  UpdateCatroon,
} from './data'

enum API {
  GetCategory = '/api/product/getCtcategory',
  AddCategory = '/api/product/addCategory',
  UpdateCategory = '/api/product/editCtcategory',
  DeleteCategory = '/api/product/deleteCtcategory',

  GetList = '/api/product/getCartoonList',
  AddList = '/api/product/addCartoon',
  DeleteLsit = '/api/product/deleteCartoon',
  UpdateList = '/api/product/editCartoon',
  GetDetail = '/api/product/getCartoonDetail',

  AddChapter = '/api/cartoon/addChapter',
  GetChapter = '/api/cartoon/getChapterList',
}

export const getCategory = (data?: GetData) =>
  Request.get(API.GetCategory, data) // 获取漫画分类

export const addCategory = (data: AddData) =>
  Request.post(API.AddCategory, data) // 添加漫画分类

export const updateCategory = (data: UpdateData) =>
  Request.post(API.UpdateCategory, data) // 修改漫画分类

export const deleteCategory = (data: DeleteData) =>
  Request.post(API.DeleteCategory, data) // 删除漫画分类

export const getList = (data: GetData) => Request.get(API.GetList, data) // 获取漫画列表

export const addList = (data: AddCartoon) => Request.post(API.AddList, data) // 添加漫画

export const deleteList = (data: DeleteData) =>
  Request.post(API.DeleteLsit, data) // 删除漫画

export const updateList = (data: UpdateCatroon) =>
  Request.post(API.UpdateList, data) // 修改漫画详情

export const getDetail = (data: GetDetail) => Request.get(API.GetDetail, data) // 获取漫画详情

export const addChapter = (data: AddChapter) =>
  Request.post(API.AddChapter, data) // 添加漫画章节

export const getChapterList = (data: GetChapter) =>
  Request.get(API.GetChapter, data) // 获取漫画章节列表
