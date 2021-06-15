import { behavior as computedBehavior } from 'miniprogram-computed';
import { styleObj2StyleStr } from '../../../utils/util';

Component({
  behaviors: [
    computedBehavior,
  ],
  /**
   * 组件的属性列表
   */
  properties: {
    totalMemory: {
      type: Number,
    },
    usedMemory: {
      type: Number,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  computed: {
    percentage: data => {
      let percentage = data.usedMemory / data.totalMemory
      percentage = Number(percentage * 100).toFixed(2)
      return `${percentage}%`
    },
    progressBarStyle: data => {
      const styleObj = {
        width: data.percentage
      }
      return styleObj2StyleStr(styleObj)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
