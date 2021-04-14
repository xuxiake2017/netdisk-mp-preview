import EventEmitter2 from 'eventemitter2'
const { FILE_TYPE } = require('./utils/fileUtils')
App({
  emitter: new EventEmitter2({

    // set this to `true` to use wildcards
    wildcard: false,
  
    // the delimiter used to segment namespaces
    delimiter: '.', 
  
    // set this to `true` if you want to emit the newListener event
    newListener: false, 
  
    // set this to `true` if you want to emit the removeListener event
    removeListener: false, 
  
    // the maximum amount of listeners that can be assigned to an event
    maxListeners: 10,
  
    // show event name in memory leak message when more than maximum amount of listeners is assigned
    verboseMemoryLeak: false,
  
    // disable throwing uncaughtException if an error event is emitted and it has no listeners
    ignoreErrors: false
  }),
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    FILE_TYPE
  }
})