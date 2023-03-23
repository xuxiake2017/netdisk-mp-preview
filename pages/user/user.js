import {
  GetInfo,
  GetDetail,
  Logout
} from '../../api/user';
import { USER_STATUS_MAP } from '../../common/constant';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import create from 'mini-stores'
import GlobalStore from '../../stores/GlobalStore'

const stores = {
  '$data': GlobalStore,
}

create.Page(stores, {

  behaviors: [
    commonBehaviors
  ],

  /**
   * 页面的初始数据
   */
  data: {
    // 当前tab
    active: 'user',
    // tabs
    tabs: [
      {
        label: '相册文件',
        value: 'home'
      },
      {
        label: '我的相册',
        value: 'gallery'
      },
      {
        label: '个人中心',
        value: 'user'
      }
    ],
    userInfo: {},
    USER_STATUS_MAP,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.GetInfoWrap()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetDetailWrap()
  },

  onTabClick(e) {
    const tab = e.detail.tab
    if (this.data.active === tab.value) return
    switch (tab.value) {
      case 'home':
        wx.switchTab({
          url: '/pages/home/home'
        })
        break
      case 'gallery':
        wx.switchTab({
          url: '/pages/gallery/gallery'
        })
        break
      case 'user':
        wx.switchTab({
          url: '/pages/user/user'
        })
        break
    }
  },
  GetInfoWrap () {
    GetInfo().then((result) => {
    })
  },
  GetDetailWrap () {
    this.setData({
      loading: true
    })
    GetDetail().then((result) => {
      this.setData({
        userInfo: result.data,
        loading: false
      })
    })
  },
  onLogout () {
    this.$showModal('提示', '确认切换账号？').then((result) => {
      Logout().then((result) => {
        GlobalStore.data.isAuth = false
        GlobalStore.update()
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/user/login'
          })
        }, 500)
      }).catch((err) => {
        this.$toast('账号切换失败！')
      });
    })
  },
  goToUserInfo () {
    wx.navigateTo({
      url: '/pages/UserInfo/UserInfo'
    })
  }
})