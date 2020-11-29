const { BASE_API } = require('../conf/index')
const requestParams = {
  header: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-Token': 'd2d8b76b-1729-4d77-b58e-6c233aaa0dcf'
  },
  timeout: 60000,
  dataType: 'json'
}

export const post = (url, data = {}, options = {}) => {
  url = `${BASE_API}/${url}`
  return new Promise((resolve, reject) => {
    const requestParams_ = Object.assign({}, requestParams, {
      url,
      data,
      ...options,
      method: 'post',
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      },
    })
    wx.request(requestParams_)
  })
}
export const get = (url, data, options) => {
  url = `${BASE_API}/${url}`
  return new Promise((resolve, reject) => {
    const requestParams_ = Object.assign({}, requestParams, {
      url,
      data,
      ...options,
      method: 'get',
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      },
    })
    wx.request(requestParams_)
  })
}
