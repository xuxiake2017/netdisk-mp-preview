import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import { styleObj2StyleStr } from '../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean
    },
    height: {
      type: String,
      value: 'auto'
    },
    width: {
      type: String,
      value: '300px'
    },
    title: {
      type: String,
    },
    showConfirmButton: {
      type: Boolean,
      value: true,
    },
    showCancelButton: {
      type: Boolean,
      value: true,
    },
    confirmButtonText: {
      type: String,
      value: '确认',
    },
    cancelButtonText: {
      type: String,
      value: '取消',
    },
  },

  options: {
    styleIsolation: 'shared'
  },

  behaviors: [
    commonBehaviors,
    computedBehavior
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  computed: {
    popupStyle: data => {
      const styleObj = {
        height: data.height,
        width: data.width,
      }
      return styleObj2StyleStr(styleObj)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose () {
      this.$emit('close')
    },
    onCancel () {
      this.$emit('cancel')
    },
    onConfirm () {
      this.$emit('confirm')
    }
  }
})
