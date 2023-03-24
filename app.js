import EventEmitter2 from 'eventemitter2'
const { FILE_TYPE } = require('./utils/fileUtils')
import { setToken } from './conf/index';
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
  onLaunch: async function () {
    this.$toast = Toast
    const { code, errMsg } = await wx.login()
    if (code) {
      const params = {
        code,
      }
      wx.showLoading({
        title: '加载中',
      })
      try {
        this.globalData.orderBy = await this.getOrderBy()
        const { data: token } = await AutoLogin(params)
        await setToken(token)
        this.emitter.emit(AUTO_LOGIN_COMPLATE)
        GlobalStore.data.isAuth = true
      } catch (error) {
        wx.hideLoading()
        this.$toast(error.msg || '登录失败！')
        GlobalStore.data.isAuth = false
      } finally {
        wx.hideLoading()
        this.globalData.inited = true
        GlobalStore.update()
      }
    } else {
      this.$toast('登录失败！' + errMsg)
    }

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
  },
  async setOrderBy (orderBy) {
    this.globalData.orderBy = orderBy
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: 'orderBy',
        data: orderBy,
        complete: (res) => {
          resolve()
        }
      })
    })
  },
  async getOrderBy () {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'orderBy',
        complete: (res) => {
          resolve(res.data || 'fileName')
        }
      })
    })
  }
})