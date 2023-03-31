import { post } from '../utils/request'

export const GetImgList = params => {
  return post('img/toImgList', params)
}

export const getGalleryList = () => {
  return post('img/getGalleryList')
}

export const getGalleryNum = () => {
  return post('img/getGalleryNum')
}