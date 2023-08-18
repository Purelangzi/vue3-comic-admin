export interface PageParams {
  pageSize?: number
  page?: number
}

export interface AddData {
  name: string
  parent_id: number
}
export interface UpdateData extends AddData {
  id: string
}
export interface DeleteData {
  ids: string | number
}

export interface GetDetail {
  id: number
}
