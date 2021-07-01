import fileListBehaviors from '../../common/behaviors/fileListBehaviors';
import { AUTO_LOGIN_COMPLATE, MOVE_FILE_SUCCESS } from '../../common/events';

const app = getApp()
Page({

  // 混入（相当于vue的mixins）
  behaviors: [
    fileListBehaviors,
  ],
  /**
   * 页面的初始数据
   */
  data: {
    // 当前tab
    active: 'home',
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar()
    if (app.globalData.inited) {
      this.getFileList()
    }
    app.emitter.once(AUTO_LOGIN_COMPLATE, () => {
      this.getFileList()
    })
    app.emitter.on(MOVE_FILE_SUCCESS, () => {
      this.resetFileList()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  // 触底
  onReachBottom() {
    if(this.data.finished) {
      return
    }
    this.setData({
      'pagination.pageNum': this.data.pagination.pageNum + 1
    })
    this.getFileList()
  },
  // 监听用户下拉刷新事件
  onPullDownRefresh () {
    this.resetFileList()
  },


  // tab切换
  onChange(event) {
    this.setData({
      active: event.detail.name
    })
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
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
  onSearchInputClick () {
    wx.navigateTo({
      url: `/pages/searchPage/searchPage`
    })
  }
})