// 小程序官方的计算属性插件
import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors  from '../../common/behaviors/commonBehaviors';
import { styleObj2StyleStr } from '../../utils/util';
Component({
  // 混入（相当于vue的mixins）
  behaviors: [computedBehavior, commonBehaviors],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
    },
    active: {
      type: String,
    },
    // 底部条宽度，默认单位rpx
    lineWidth: {
      type: [String, Number],
      value: '30%'
    },
    // 底部条高度，默认单位rpx
    lineHeight: {
      type: [String, Number],
      value: '5rpx'
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    containerWidth: 0,
    scrollLeft: null,
    tabWidth: 0,
  },
  // 计算属性
  computed: {
    // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    tabsLength: data => {
      return data.tabs.length
    },
    tabIndex: function (data) {
      let index_ = null
      data.tabs.find((item, index) => {
        index_ = index
        return item.value === data.active
      })
      return index_
    },
    lineStyle: data => {
      const styleObject = {}
      if (typeof data.lineWidth === 'number') {
        styleObject.width = `${data.lineWidth}rpx`
      } else {
        styleObject.width = data.lineWidth
      }
      if (typeof data.lineHeight === 'number') {
        styleObject.height = `${data.lineHeight}rpx`
      } else {
        styleObject.height = data.lineHeight
      }
      styleObject.transform = `translateX(${data.tabWidth * data.tabIndex + data.tabWidth / 2}px) translateX(-50%)`
      return styleObj2StyleStr(styleObject)
    }
  },
  /**
   * 组件的生命周期函数
   */
  lifetimes: {
    ready: function() {
      // 在组件在视图层布局完成后执行
      this.$uGetRect('.tabs-wrap').then(res => {
        const containerWidth = res.width
        const tabWidth = containerWidth / this.data.tabsLength
        this.setData({
          containerWidth,
          tabWidth,
        })
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabClick(e) {
      const tab = e.currentTarget.dataset.tab
      this.triggerEvent('tab-click', { tab })
    }
  }
})
