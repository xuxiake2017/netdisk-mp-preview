class GlobalStore {

  data = {
    isAuth: null,
    showNoAuth() {
      return this.isAuth !== null && this.isAuth === false
    },
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
    activeTab: 'home',
    pageInitialized: {
      home: true,
      gallery: false,
      user: false,
    }
  }

  setActiveTab (val) {
    wx.setNavigationBarTitle({
      title: this.data.tabs.find(tab => tab.value === val).label
    })
    if (!this.data.pageInitialized[val]) {
      this.setPageInitialized({
        [val]: true
      })
    }
    this.data.activeTab = val
    this.update()
  }

  setPageInitialized (val) {
    this.data.pageInitialized = {
      ...this.data.pageInitialized,
      ...val
    }
  }
  loginSuccess () {
    this.data.isAuth = true
    this.data.activeTab = 'home'
    this.data.pageInitialized = {
      home: true,
      gallery: false,
      user: false,
    }
    this.update()
  }
}

export default new GlobalStore()