import { device, rect } from '../../conf/index';

/**
 * 自定义导航栏
 */
Component({
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    // 是否使用slot
    $slots: {
      type: Object,
      value: {
        left: false,
        title: false,
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 状态栏高度（px）
    statusBarHeight: 0,
    navBarHeight: 0,
    menuButtonHeight: 0,
    menuButtonWidth: 0,
  },

  /**
   * 组件的生命周期函数
   */
   lifetimes: {
    ready: function() {
      const {
        statusBarHeight
      } = device
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
      this.triggerEvent('on-ready', {
        statusBarHeight,
        navBarHeight,
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
  }
})
