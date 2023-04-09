import commonBehaviors from '../../common/behaviors/commonBehaviors';
import { FILE_TYPE } from '../../utils/fileUtils';
Component({
  behaviors: [
    commonBehaviors
  ],
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否展示上传操作弹窗
    show: {
      type: Boolean
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },

  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {
    FILE_TYPE
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPopupClose () {
      this.$emit('popupClose')
    },
    onUploadItemClick (e) {
      const type = e.currentTarget.dataset.type
      this.$emit('uploadItemClick', { type })
    },
  }
})
