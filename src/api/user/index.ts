import Request from '@/utils/request'
import { LoginFormData } from './type'

enum API {
  Login = '/user/login',
  Register = '/user/reg',
}

export const reqLogin = (data: LoginFormData) => Request.post(API.Login, data)
export const reqRegister = (data: LoginFormData) =>
  Request.post(API.Register, data)
