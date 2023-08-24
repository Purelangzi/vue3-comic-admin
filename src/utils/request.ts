import axios from 'axios'
import { stringify } from 'qs'
import { useUserInfoStore } from '@/store/modules/user'
// 处理 类型AxiosResponse<any, any>上不存在属性code,mss等
declare module 'axios' {
  interface AxiosResponse<T> {
    data: T
    code: number
    msg: string
  }
}
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 25000,
})

request.interceptors.request.use(
  (config) => {
    const useUserStore = useUserInfoStore()
    if (useUserStore.token) {
      config.headers['token'] = 'Bearer ' + useUserStore.token // 请求头添加token和Bearer
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
request.interceptors.response.use(
  (response) => {
    const res = response.data
    const code = response.status
    // HTTP 状态码>=200且<300表示成功；>=400且<=500为客户端错误；>500为服务端错误
    if ((code >= 200 && code < 300) || code === 304) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res.msg || 'Error')
    }
  },
  (error) => {
    if (error.response) {
      const useUserStore = useUserInfoStore()
      const status = error.response.status
      switch (status) {
        case 400:
          ElMessage.error('请求错误')
          break
        case 401:
          ElMessage.error('token失效')
          useUserStore.resetToken()
          location.reload()
          break
        case 404:
          ElMessage.error('接口请求地址错误')
          break
        default:
          ElMessage.error(error.response.data?.msg || 'error')
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时！请检查网络是否正常')
      } else {
        ElMessage.error('请求失败，请检查网络是否已连接')
      }
    }

    return Promise.reject(error)
  },
)
export default {
  get(url: string, params?: any) {
    return request.get(url, { params })
  },
  post(url: string, data: any) {
    return request({
      method: 'post',
      url,
      // 配置post的请求头，默认是表单提交（axios默认post请求头是application/json，不需要qs.stringify)
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: stringify(data),
    })
  },
  // 文件上传
  upload(url: string, data: any) {
    return request({
      method: 'post',
      url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data,
    })
  },
}
