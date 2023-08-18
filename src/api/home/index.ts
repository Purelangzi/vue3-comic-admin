import Request from '@/utils/request'
import { GetData } from '../cartoon/data'

enum API {
  HOME_URL = '/api/product/getCartoonList',
}

export const getCartoonList = (data: GetData) => Request.get(API.HOME_URL, data)
