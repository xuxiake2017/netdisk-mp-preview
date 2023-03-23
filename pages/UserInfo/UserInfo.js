import { behavior as computedBehavior } from 'miniprogram-computed';
import { styleObj2StyleStr } from '../../utils/util';
import { encode } from '../../utils/encryptUtil';
import test from '../../utils/test';
import {
  GetDetail,
  uploadAvatarAction,
  updatePassword,
  updateUserInfo,
} from '../../api/user';
import { getToken } from '../../conf/index';
import Toast from '../../common/behaviors/Toast';

const app = getApp()
const {
  password: passwordTest,
} = test

const updatePasswordHandler = async (params) => {
  try {
    const res = await updatePassword(params)
    Toast.success('密码修改成功！')
    return true
  } catch (error) {
    Toast(error.msg || '密码修改失败！')
    return false
  }
}

const updateHandler = async (params) => {
  try {
    const res = await updateUserInfo(params)
    Toast.success('修改成功！')
    return true
  } catch (error) {
    Toast(error.msg || '用户信息修改失败！')
    return false
  }
}

Component({
  behaviors: [
    computedBehavior
  ],
  data: {
    customNavHeight: 0,
    modifyDialogTitle: '修改昵称',
    modifyDialogShow: false,
    modifyDialogAction: '',
    fieldValue: '',
    newPassword: '',
    repeatPassword: '',
    userInfo: {},
  },
  computed: {
    contentStyle: data => {
      const styleObj = {
        height: `calc(100vh - ${data.customNavHeight}px)`
      }
      return styleObj2StyleStr(styleObj)
    }
  },
  methods: {
    onNavReady (e) {
      const {
        statusBarHeight,
        navBarHeight,
      } = e.detail
      this.setData({
        customNavHeight: statusBarHeight + navBarHeight
      })
    },
    async onDialogConfirm () {
      const {
        fieldValue,
        newPassword,
        repeatPassword,
      } = this.data
      switch (this.data.modifyDialogAction) {
        case 'updateNickName':
          if (!fieldValue) {
            Toast('请输入昵称！')
            return
          }
          this.setData({
            'userInfo.nickName': fieldValue,
            modifyDialogShow: false,
          })
          break
        case 'updatePassword':
          if (!newPassword) {
            Toast('请输入新密码！')
            return
          }
          if (!repeatPassword) {
            Toast('请确认密码！')
            return
          }
          if (newPassword !== repeatPassword) {
            Toast('两次输入密码不一致！')
            return
          }
          if (!passwordTest(newPassword)) {
            Toast('密码应为数字、大小写字母以及特殊字符')
            return
          }
          if (newPassword.length < 6) {
            Toast('密码长度不能小于6位')
            return
          }
          const params = {
            newPassword: encode(newPassword),
            repeatPassword: encode(repeatPassword),
          }
          const res = await updatePasswordHandler(params)
          if (res) {
            this.setData({
              modifyDialogShow: false,
            })
          }
          break
      }
    },
    onDialogCancel () {
      this.setData({
        modifyDialogShow: false,
      })
    },
    onDialogClose () {
      this.setData({
        modifyDialogShow: false,
      })
    },
    clearInput (e) {
      const field = e.target.dataset.field
      this.setData({
        [field]: '',
      })
    },
    async init () {
      try {
        const res = await GetDetail()
        this.setData({
          userInfo: res.data
        })
      } catch (error) {
        
      }
    },
    onAvatarClick () {
      wx.navigateTo({
        url: '/pages/UserInfo/AvatarCropper/AvatarCropper'
      })
    },
    async uploadAvatar (tempFilePath) {
      const token = await getToken()
      const header = {
        'X-Token': token
      }
      try {
        const res = await new Promise((resolve, reject) => {
          wx.uploadFile({
            url: uploadAvatarAction,
            filePath: tempFilePath,
            name: 'file',
            header,
            success: res => {
              const result = JSON.parse(res.data)
              if (result.code === 20000) {
                resolve(result)
              } else {
                reject(result)
              }
            }
          })
        })
        this.setData({
          'userInfo.avatar': res.data,
        })
      } catch (error) {
        
      }
    },
    updateNickName () {
      this.setData({
        fieldValue: this.data.userInfo.nickName,
        modifyDialogTitle: '修改昵称',
        modifyDialogShow: true,
        modifyDialogAction: 'updateNickName',
      })
    },
    updatePassword () {
      this.setData({
        modifyDialogTitle: '修改密码',
        modifyDialogShow: true,
        modifyDialogAction: 'updatePassword',
        newPassword: '',
        repeatPassword: '',
      })
    },
    async onSubmit () {
      const {
        avatar,
        nickName,
        id,
      } = this.data.userInfo
      const params = {
        avatar,
        nickName,
        id,
      }
      updateHandler(params)
    },
  },
  lifetimes: {
    ready () {
      this.init()
      app.emitter.on('avatarCropperOver', tempFilePath => {
        this.uploadAvatar(tempFilePath)
      })
    }
  }
})