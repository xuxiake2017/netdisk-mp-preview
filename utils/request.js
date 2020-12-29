const { BASE_API } = require('../conf/index')
const requestParams = {
  header: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-Token': '98ae938c-1050-4e2f-a7e0-cb03010f98d4'
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
