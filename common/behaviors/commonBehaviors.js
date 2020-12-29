export default Behavior({
  methods: {
    // 获取节点信息
    $uGetRect(selector, all) {
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
  }
})