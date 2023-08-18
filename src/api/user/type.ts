//用户登录接口携带参数的ts类型
export interface LoginFormData {
  account: string
  password: string
  username?: string
}

//定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  msg: string
  data: any
}
