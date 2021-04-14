const Toast = function (options) {
  return new Promise((resolve, reject) => {
    if (typeof options === 'string') {
      wx.showToast({
        title: options,
        icon: 'none',
        success: resolve,
        fail: reject,
      })
    } else if (typeof options === 'object') {
      options.success = resolve
      options.fail = reject
      wx.showToast(options)
    }
  })
}

const methods = ['success', 'error']

const prototype = Object.getPrototypeOf(Toast)

methods.forEach(type => {
  prototype[type] = options => {
    if (typeof options === 'string') {
      options = {
        title: options
      }
    }
    options.icon = type
    return Toast(options)
  }
})

export default Toast