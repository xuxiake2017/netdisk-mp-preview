import EventEmitter2 from 'eventemitter2'
const { FILE_TYPE } = require('./utils/fileUtils')
import CONFIG from './conf/index';
import { AutoLogin } from './api/user';
import Toast from './common/behaviors/Toast';
import { AUTO_LOGIN_COMPLATE } from './common/events';
import GlobalStore from './stores/GlobalStore';

App({
  // 在小程序上使用全局的消息订阅
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
    this.$toast = Toast
    wx.getStorage({
      key: 'X-Token',
      complete: (res1) => {
        CONFIG.token = res1.data ? res1.data : ''
        wx.login({
          success: (res2) => {
            if (res2.code) {
              const params = {
                code: res2.code,
              }
              wx.showLoading({
                title: '加载中',
              })
              AutoLogin(params).then(res3 => {
                wx.setStorage({
                  key: "X-Token",
                  data: res3.data
                })
                CONFIG.token = res3.data
                // this.globalData.inited = true
                this.emitter.emit(AUTO_LOGIN_COMPLATE)
                GlobalStore.data.isAuth = true
                // GlobalStore.update()
              }).catch(err => {
                // this.globalData.inited = true
                this.$toast(err.msg || '登录失败！')
                if (err.code === 20011) { // 未注册
                  // setTimeout(() => {
                  //   wx.reLaunch({
                  //     url: '/pages/user/login'
                  //   })
                  // }, 500);
                }
                GlobalStore.data.isAuth = false
                // GlobalStore.update()
              }).finally(() => {
                wx.hideLoading()
                this.globalData.inited = true
                GlobalStore.update()
              })
            } else {
              this.$toast('登录失败！' + res2.errMsg)
            }
          }
        })
      }
    })

    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  globalData: {
    userInfo: null,
    FILE_TYPE,
    // 小程序是否完成初始化
    inited: false,
    // 要操作移动的文件
    moveOptFile: {},
    // 排序方式
    orderBy: 'fileName',
  }
})