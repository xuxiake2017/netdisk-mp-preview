import commonBehaviors from '../../../common/behaviors/commonBehaviors';
Component({

  behaviors: [
    commonBehaviors
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    // shared 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件
    styleIsolation: 'shared',
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String
    },
    type: {
      type: String,
      value: 'text'
    },
    placeholder: {
      type: String
    },
    leftIcon: {
      type: String
    },
    showRight: {
      type: Boolean,
      value: false
    },
    limit: {
      type: Number,
      value: -1
    },
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
    onInput (e) {
      this.$emit('input', e)
      if (this.data.limit === -1) {
        return
      }
      const value = e.detail.value
      this.setData({
        value: value.slice(0, this.data.limit)
      })
    }
  }
})
