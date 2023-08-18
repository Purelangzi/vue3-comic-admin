import { PageParams } from '../type'

export interface GetAccountData extends PageParams {
  username?: string
  phone?: string
}
export interface AddAccountData {
  username: string
  password: string
  phone: string
  email: string
  avatar?: string
}
export interface UpdateAccountData extends AddAccountData {
  id: number
  role_id: string
}

export interface GetRoleData extends PageParams {
  role_name?: string
}
export interface AddRoleData {
  role_name: string
  role_value?: string
  remark?: string
  role_status?: number
  menus?: string
}

export interface UpdateRoleData extends AddRoleData {
  id: number
}
