import Request from '@/utils/request'
import { DeleteData } from '../type'
import {
  AddAccountData,
  AddRoleData,
  GetAccountData,
  GetRoleData,
  UpdateAccountData,
  UpdateRoleData,
} from './data'

enum API {
  GetAccount = '/api/system/account',
  AddAccount = '/api/system/addAccount',
  EditAccount = '/api/system/editAccount',
  DeleteAccount = '/api/system/deleteAccount',
  GetRole = '/api/system/role',
  AddRole = '/api/system/addRole',
  EditRole = '/api/system/editRole',
  DeleteRole = '/api/system/deleteRole',
}
// 获取账号列表
export const getAccount = (data?: GetAccountData) =>
  Request.get(API.GetAccount, data)
// 新增账号
export const addAccount = (data: AddAccountData) =>
  Request.post(API.AddAccount, data)
// 修改账号
export const editAccount = (data: UpdateAccountData) =>
  Request.post(API.EditAccount, data)
// 删除账号
export const deleteAccount = (data: DeleteData) =>
  Request.post(API.DeleteAccount, data)

// 获取角色列表
export const getRole = (data?: GetRoleData) => Request.get(API.GetRole, data)
// 新增角色
export const addRole = (data: AddRoleData) => Request.post(API.AddRole, data)
// 修改角色
export const editRole = (data: UpdateRoleData) =>
  Request.post(API.EditRole, data)
// 删除角色
export const deleteRole = (data: DeleteData) =>
  Request.post(API.DeleteRole, data)
