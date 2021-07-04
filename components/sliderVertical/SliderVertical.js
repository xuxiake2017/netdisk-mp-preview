Component({
  properties: {
    blockColor: {
      type: String,
      value: "#ffffff"
    },
    blockSize: {
      type: Number,
      value: 28
    },
    backgroundColor: {
      type: String,
      value: "#e9e9e9"
    },
    activeColor: {
      type: String,
      value: "#1aad19"
    },
    step: {
      type: Number,
      value: 1
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 100
    },
    value: {
      type: Number,
      value: 0
    },
    disabled: {
      type: Boolean,
      value: false
    },
    showValue: {
      type: Boolean,
      value: false
    },
  },
  observers: {
    'blockSize': function(blockSize) {
      if (blockSize > 28) {
        this.setData({
          blockSize: 28
        })
      } else if (blockSize < 12) {
        this.setData({
          blockSize: 12
        })
      }
    },
    'showValue': function(){
      this.queryHeight() // 由于显示数字后，滑动区域变化，需要重新查询可滑动高度
    }
  },
  data: {
    totalTop: null,
    totalHeight: null,
    currentValue: 0,
  },
  methods: {
    setCurrent: function(e){
      this.setData({
        currentValue: e.value
      })
    },
    queryHeight: function(){
      wx.createSelectorQuery().in(this).select('.slider-container').boundingClientRect((res) => {
        this.setData({
          totalTop: res.top,
          totalHeight: res.height
        })
      }).exec()
    },
    empty: function(){},
  }
})