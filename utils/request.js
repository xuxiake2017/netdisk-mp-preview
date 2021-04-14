const {
  BASE_API,
  token
} = require('../conf/index')
const requestParams = {
  header: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-Token': token
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
        if (res.data) {
          if (res.data.code === 20000) {
            resolve(res.data)
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
