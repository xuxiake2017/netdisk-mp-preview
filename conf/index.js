const CONFIG = {
  BASE_API: 'http://localhost:8080/netdisk',
  token: '',
  appid: 'wx14b170f0e0445918',
  version: 'v2.0.3'
}
export const getToken = () => {
  return new Promise((resolve, reject) => {
    if (CONFIG.token) {
      resolve(CONFIG.token)
    }
    wx.getStorage({
      key: 'X-Token',
      complete: (res) => {
        CONFIG.token = res.data ? res.data : ''
        resolve(CONFIG.token)
      }
    })

  })
}

export const setToken = (token) => {
  return new Promise((resolve, reject) => {
    CONFIG.token = token
    wx.setStorage({
      key: "X-Token",
      data: token,
      complete: () => {
        resolve()
      }
    })
  })
  
}

export const rect = wx.getMenuButtonBoundingClientRect()
export const device = wx.getSystemInfoSync()

export default CONFIG