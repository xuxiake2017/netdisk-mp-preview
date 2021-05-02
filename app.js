import EventEmitter2 from 'eventemitter2'
const { FILE_TYPE } = require('./utils/fileUtils')
import CONFIG from './conf/index';
import { AutoLogin } from './api/user';
import Toast from './common/behaviors/Toast';

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
              AutoLogin(params).then(res3 => {
                wx.setStorage({
                  key: "X-Token",
                  data: res3.data
                })
                CONFIG.token = res3.data
              }).catch(err => {
                this.$toast(err.msg || '登录失败！')
              })
            } else {
              this.$toast('登录失败！' + res2.errMsg)
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    FILE_TYPE
  }
})