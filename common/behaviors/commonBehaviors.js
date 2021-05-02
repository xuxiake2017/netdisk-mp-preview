import Toast from './Toast'

const app = getApp()
export default Behavior({
  created () {
    this.$toast = Toast
  },
  methods: {
    // 获取节点信息
    $uGetRect (selector, all) {
      return new Promise(resolve => {
        wx.createSelectorQuery().
        in(this)[all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect)
            }
            if (!all && rect) {
              resolve(rect)
            }
          })
          .exec()
      })
    },
    $showModal (title = '提示', content = '确认删除？') {
      return new Promise((resolve, reject) => {
        wx.showModal({
          title,
          content,
          success (res) {
            if (res.confirm) {
              resolve()
            } else if (res.cancel) {
              reject()
            }
          }
        })
      })
    },
    $hideLoading () {
      wx.hideLoading()
    },
    $showLoading (options = '加载中') {
      return new Promise((resolve, reject) => {
        if (typeof options === 'string') {
          wx.showLoading({
            title: options,
            mask: true,
            success: resolve,
            fail: reject,
          })
        } else {
          options.success = resolve
          options.fail = reject
          wx.showLoading(options)
        }
      })
    },
    $emit (name, detail = {}) {
      this.triggerEvent(name, detail)
      app.emitter.emit(name, detail)
    },
    $on (name, func) {
      app.emitter.on(name, func)
    },
  }
})