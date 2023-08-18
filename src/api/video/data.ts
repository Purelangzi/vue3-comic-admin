import { PageParams } from '../type'
export interface GetData extends PageParams {
  name?: string
}
export interface GetChapter extends PageParams {
  comic_id: number
  isAll: boolean
}
export interface AddVideo {
  category_id: string
  director: string
  name: string
  platform_comic?: string
  cover_lateral?: string
  cartoon_introduction?: string
  price?: number
}
export interface UpdateVideo extends AddVideo {
  id: number
  charge: number
  fabulous: number
  read: string
  status: number
  collection: string
}
export interface AddChapter {
  comic_id: number
  title: string
  title_alias: number
  is_vip: number
  platform_chapter?: number
}
