export interface QueryNovelDetailData {
  pageId: string | number
  comicId: string | number
  type?: number
}
export interface QueryVideoDetailData {
  comicId: number
  type: number
}
export interface QueryDetailData {
  comicId: string
  chapterId: string
  method: string
  platform: number
  detail: number
}
export interface CatroonLinkData {
  platform: number
  page: number
}
export interface NovelLinkData {
  category_id: string
  page: number
}
export interface VideoLinkData {
  page: number
}
