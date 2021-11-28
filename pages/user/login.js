import {
  LoginAndRegister,
  GetCaptcha,
  VerifyCaptcha,
  SendSMSCaptcha,
} from '../../api/user';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import {
  makeSign,
} from '../../utils/encryptUtil';
import CONFIG from '../../conf/index';
import test from '../../utils/test';

const { appid } = CONFIG
const {
  code,
  mobile,
} = test
Component({ // 使用 Component 构造器构造页面

  behaviors: [
    commonBehaviors
  ],
  /**
   * 页面的初始数据
   */
  data: {
    // 微信获取的用户信息
    userInfo: {},
    // 对话框标题
    dialogTitle: '输入验证码',
    // 对话框是否显示
    dialogShow: false,
    // 验证图形验证码参数
    verifyCaptcha: {
      uuid: '',
      captchaBASE64: '',
    },
    // 图形验证码是否验证通过
    verifyPass: false,
    // 发送短信展示倒计时
    showCountDown: false,
    // 倒计时
    countDownTime: 60,
    // 图形验证码
    captcha: '',
    // 短信验证码
    smsCaptcha: '',
    // 电话号码
    phone: '',
    loginAndRegisterParam: {
      uuid: ''
    },
    timer: null
  },

  methods: {
    onUnload () {
      if (this.data.timer) {
        clearInterval(this.data.timer)
      }
    },

    // 登录注册
    login () {
      if (!this.data.phone) {
        this.$toast('请输入手机号码！')
        return
      }
      if (!this.data.smsCaptcha) {
        this.$toast('请输入短信验证码！')
        return
      }
      if (!mobile(this.data.phone)) {
        this.$toast('请输入正确的手机号码！')
        return
      }
      if (!code(this.data.smsCaptcha, 4)) {
        this.$toast('短信验证码为4位数字！')
        return
      }
      if (Object.keys(this.data.userInfo).length === 0) {
        wx.getUserProfile({
          desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            this.setData({
              userInfo: {
                ...res.userInfo,
                nickName: '不长胖的小尹🙋'
              },
            })
            this.loginAndRegister()
          },
          fail: (err) => {
            this.$toast('您拒绝了授权')
          }
        })
      } else {
        this.loginAndRegister()
      }
    },
    loginAndRegister () {
      wx.login({
        success: (res) => {
          if (res.code) {
            const params = {
              code: res.code,
              uuid: this.data.loginAndRegisterParam.uuid,
              smsCaptcha: this.data.smsCaptcha,
              phone: this.data.phone,
              wechatUserInfo: this.data.userInfo
            }
            LoginAndRegister(params).then(res1 => {
              this.$toast.success(res1.msg)
              CONFIG.token = res1.data
              if (this.data.timer) {
                clearInterval(this.data.timer)
              }
              wx.setStorage({
                key: "X-Token",
                data: res1.data,
                success: () => {
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '/pages/home/home'
                    })
                  }, 500)
                }
              })
            }).catch(err => {
              this.$toast(err.msg)
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    // 获取验证码
    getCaptcha () {
      if (!this.data.phone) {
        this.$toast('请输入手机号码！')
        return
      }
      if (!mobile(this.data.phone)) {
        this.$toast('请输入正确的手机号码！')
        return
      }
      if (this.data.showCountDown) {
        return
      }
      const params = {
        uuid: this.data.verifyCaptcha.uuid
      }
      this.$showLoading()
      GetCaptcha(params).then(res => {
        this.$hideLoading()
        this.setData({
          verifyCaptcha: res.data,
          dialogShow: true
        })
      })
    },
    // 验证验证码
    verifyCaptcha () {
      const params = {
        uuid: this.data.verifyCaptcha.uuid,
        captcha: this.data.captcha
      }
      VerifyCaptcha(params).then(res => {
        this.sendSMSCaptcha()
        this.startCountDown()
        this.setData({
          dialogShow: false,
          showCountDown: true,
          verifyPass: true,
          countDownTime: 60
        })
      }).catch(err => {
        this.$toast(err.msg)
        setTimeout(() => {
          this.getCaptcha()
        }, 500)
      })
    },
    onDialogConfirm () {
      this.verifyCaptcha()
    },
    onDialogCancel () {
      this.setData({
        dialogShow: false,
      })
    },
    onDialogClose () {},
    clearInput () {
      this.setData({
        captcha: ''
      })
    },
    // 开始倒计时
    startCountDown () {
      const timer = setInterval(() => {
        if (this.data.countDownTime === 0) {
          clearInterval(timer)
          this.setData({
            showCountDown: false
          })
        } else {
          const time = this.data.countDownTime - 1
          this.setData({
            countDownTime: time
          })
        }
      }, 1000)
      this.setData({
        timer
      })
    },
    // 发送短信验证码
    sendSMSCaptcha () {
      const params = {
        _appid: appid,
        _sign: '',
        _timestamp: new Date().getTime(),
        phone: this.data.phone
      }
      const sign = makeSign(params, appid)
      params._sign = sign
      
      SendSMSCaptcha(params).then(res => {
        this.$toast.success(res.msg)
        this.setData({
          'loginAndRegisterParam.uuid': res.data
        })
      })
    }
  }
})