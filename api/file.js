import { post } from '../utils/request'
import CONFIG from '../conf/index';
const {
  BASE_API,
} = CONFIG

export const GetFileList = params => {
  return post('file/listFile', params)
}

export const CheckMd5 = params => {
  return post('file/checkMd5', params)
}

export const UploadMD5 = params => {
  return post('file/uploadMD5', params)
}

export const ListAllDir = params => {
  return post('dir/listAllDir', params)
}

export const MkDir = params => {
  return post('dir/mkDir', params)
}

export const MoveFile = params => {
  return post('dir/moveFile', params)
}

export const ReName = params => {
  return post('file/reName', params)
}

export const GetDocumentList = params => {
  return post('file/getDocumentList', params)
}

export const GetVideoList = params => {
  return post('file/getVideoList', params)
}

export const GetAudioList = params => {
  return post('file/getAudioList', params)
}

export const GetPicList = params => {
  return post('file/getPicList', params)
}

export const DeleteFile = params => {
  return post('file/deleteFile', params)
}

export const GetPathStore = params => {
  return post('file/getPathStore', params)
}

export const FindById = params => {
  return post('file/findById', params)
}

export const GetFileMediaInfo = params => {
  return post('file/getFileMediaInfo', params)
}

export const fileUploadAction = `${BASE_API}/file/fileUpload`
