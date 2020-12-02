Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 状态栏高度（px）
    statusBarHeight: 0,
    navBarHeight: 0,
    menuButtonHeight: 0,
    menuButtonWidth: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo().then(({ info, rect }) => {
      console.log(info)
      console.log(rect)
      const {
        statusBarHeight
      } = info
      let {
        top,
        height,
        width
      } = rect
      top += 2
      const navBarHeight = (top - statusBarHeight) * 2 + height
      this.setData({
        statusBarHeight,
        navBarHeight,
        menuButtonHeight: height,
        menuButtonWidth: width,
      })
    })
  },
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      const rect = wx.getMenuButtonBoundingClientRect()
      wx.getSystemInfo({
        success: info => {
          resolve({
            info, rect
          })
        }
      })
    })
  },
  goBack() {
    wx.navigateBack()
  },
  goHome() {
    // wx.redirectTo({
    //   url: '/pages/home/home'
    // })
    wx.reLaunch({
      url: '/pages/home/home'
    })
  },
})