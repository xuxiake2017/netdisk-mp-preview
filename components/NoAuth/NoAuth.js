// components/NoAuth/NoAuth.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLogin () {
      wx.reLaunch({
        url: '/pages/user/login'
      })
    }
  }
})
