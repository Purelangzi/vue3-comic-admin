import { PageParams } from '../type'
export interface GetData extends PageParams {
  name?: string
}
export interface GetChapter extends PageParams {
  comic_id: number
  isAll: boolean
}
export interface AddCartoon {
  platform_comic: string
  author: string
  name: string
  img_url: string
  cover_lateral: string
  cartoon_introduction: string
  price: number
  category_id: number
}
export interface UpdateCatroon extends AddCartoon {
  id: number
  charge: number
  fabulous: number
  read: string
  status: number
  update_time: string
  create_time: string
}
export interface AddChapter {
  comic_id: number
  cover?: string
  title: string
  title_alias: number
  is_vip: number
  platform_chapter?: number
}
