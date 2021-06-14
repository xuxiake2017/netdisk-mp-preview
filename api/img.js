import { post } from '../utils/request'

export const GetImgList = params => {
  return post('img/toImgList', params)
}