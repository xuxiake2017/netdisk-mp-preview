import CONFIG, { getToken } from '../conf/index';
import GlobalStore from '../stores/GlobalStore';
import Toast from '../common/behaviors/Toast';
const {
  BASE_API,
} = CONFIG

const request = async (url, method, data = {}, options = {}) => {

  const token = await getToken()
  const requestParams = {
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-Token': token
    },
    timeout: 60000,
    dataType: 'json'
  }
  url = `${BASE_API}/${url}`
  return new Promise((resolve, reject) => {
    const requestParams_ = Object.assign({}, requestParams, {
      url,
      data,
      ...options,
      method: 'post',
      success: (res) => {
        if (res.data) {
          if (res.data.code === 20000) {
            resolve(res.data)
          } else if (res.data.code === 41000) {
            Toast.error('登录失效')
            GlobalStore.data.isAuth = false
            GlobalStore.update()
            reject(res.data)
          } else {
            reject(res.data)
          }
        }
      },
      fail: (res) => {
        reject(res)
      },
    })
    wx.request(requestParams_)
  })
}
export const get = (url, data, options) => {
  return request(url, 'get', data, options)
}
export const post = (url, data, options) => {
  return request(url, 'get', data, options)
}
export const postJSON = async (url, data) => {
  const token = await getToken()
  return request(url, 'post', data, {
    header: {
      'content-type': 'application/json',
      'X-Token': token
    }
  })
}
export default request
