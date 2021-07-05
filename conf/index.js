const CONFIG = {
  BASE_API: 'http://127.0.0.1:8080/netdisk',
  token: '',
  appid: 'wx14b170f0e0445918',
  version: 'v1.0.3'
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
export default CONFIG