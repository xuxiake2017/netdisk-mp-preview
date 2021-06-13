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
    active: 1,
    // tabs
    tabs: [
      {
        label: '网盘文件',
        value: 1
      },
      {
        label: '文件分享',
        value: 2
      },
      {
        label: '个人中心',
        value: 3
      }
    ],
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onTabClick(e) {
    const tab = e.detail.tab
    this.setData({
      active: tab.value
    })
  },

  clearInput () {
    this.setData({
      fileName: ''
    })
  }
})